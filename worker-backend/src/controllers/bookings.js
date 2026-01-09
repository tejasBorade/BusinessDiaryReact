import { NotificationService } from '../services/notificationService.js';

export class BookingController {
  constructor(env) {
    this.db = env.DB;
    this.notificationService = new NotificationService(env);
  }

  async getAll(request) {
    try {
      // Get user from request context (set by auth middleware)
      const user = request.user;
      
      // Build query with owner filter for store_owner role
      let query = `
        SELECT 
          b.*,
          bs.id as business_id,
          bs.name as business_name,
          bs.address as business_address,
          bs.phone as business_phone,
          bs.owner_id as business_owner_id,
          c.id as category_id,
          c.name as category_name,
          sc.id as subcategory_id,
          sc.name as subcategory_name,
          u.id as user_id_ref,
          u.full_name as user_name,
          u.email as user_email
        FROM bookings b
        LEFT JOIN businesses bs ON b.business_id = bs.id
        LEFT JOIN categories c ON bs.category_id = c.id
        LEFT JOIN subcategories sc ON bs.subcategory_id = sc.id
        LEFT JOIN users u ON b.user_id = u.id
      `;
      
      // Filter by owner_id if user is store_owner
      if (user && user.role === 'store_owner') {
        query += ` WHERE bs.owner_id = ${user.userId}`;
      }
      
      query += ` ORDER BY b.created_at DESC`;
      
      const bookings = await this.db.prepare(query).all();

      // Transform the flat data into nested structure
      const transformedBookings = bookings.results.map(row => ({
        id: row.id,
        business_id: row.business_id,
        user_id: row.user_id,
        booking_date: row.booking_date,
        booking_time: row.booking_time,
        status: row.status,
        notes: row.notes,
        admin_comments: row.admin_comments,
        customer_name: row.customer_name,
        customer_email: row.customer_email,
        customer_phone: row.customer_phone,
        service_type: row.service_type,
        created_at: row.created_at,
        business: {
          id: row.business_id,
          name: row.business_name,
          address: row.business_address,
          phone: row.business_phone,
          category: row.category_id ? {
            id: row.category_id,
            name: row.category_name
          } : null,
          subcategory: row.subcategory_id ? {
            id: row.subcategory_id,
            name: row.subcategory_name
          } : null
        },
        user: row.user_id_ref ? {
          id: row.user_id_ref,
          name: row.user_name,
          email: row.user_email
        } : null
      }));

      return new Response(
        JSON.stringify({ bookings: transformedBookings }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  async create(request) {
    try {
      const data = await request.json();
      const { 
        business_id, 
        user_id, 
        booking_date, 
        booking_time, 
        notes, 
        message,
        customer_name, 
        customer_email, 
        customer_phone, 
        service_type 
      } = data;

      // Use message as notes if notes is not provided
      const bookingNotes = notes || message || null;
      
      // user_id can be null for guest bookings
      const userId = user_id || null;

      const result = await this.db.prepare(
        `INSERT INTO bookings 
        (business_id, user_id, booking_date, booking_time, notes, customer_name, customer_email, customer_phone, service_type) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        business_id, 
        userId, 
        booking_date, 
        booking_time, 
        bookingNotes,
        customer_name || null,
        customer_email || null,
        customer_phone || null,
        service_type || null
      ).run();

      const booking = await this.db.prepare(
        'SELECT * FROM bookings WHERE id = ?'
      ).bind(result.meta.last_row_id).first();

      // Get business and owner details for notifications
      const businessDetails = await this.db.prepare(`
        SELECT 
          b.id, b.name, b.address, b.phone, b.owner_id,
          u.email as owner_email, u.phone as owner_phone, u.full_name as owner_name
        FROM businesses b
        LEFT JOIN users u ON b.owner_id = u.id
        WHERE b.id = ?
      `).bind(business_id).first();

      // Send notifications (async, don't wait)
      if (businessDetails) {
        this.notificationService.notifyNewBooking(
          booking,
          {
            name: businessDetails.name,
            address: businessDetails.address,
            phone: businessDetails.phone,
            owner_name: businessDetails.owner_name
          },
          {
            name: customer_name,
            email: customer_email,
            phone: customer_phone
          },
          businessDetails.owner_email,
          businessDetails.owner_phone
        ).catch(err => console.error('Notification error:', err));
      }

      return new Response(
        JSON.stringify({ booking }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  async getById(id) {
    try {
      const booking = await this.db.prepare(
        'SELECT * FROM bookings WHERE id = ?'
      ).bind(id).first();

      if (!booking) {
        return new Response(
          JSON.stringify({ error: 'Booking not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ booking }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  async update(request, id) {
    try {
      const data = await request.json();
      
      // Build dynamic UPDATE query with only provided fields
      const updates = [];
      const values = [];
      
      if (data.booking_date !== undefined) {
        updates.push('booking_date = ?');
        values.push(data.booking_date);
      }
      if (data.booking_time !== undefined) {
        updates.push('booking_time = ?');
        values.push(data.booking_time);
      }
      if (data.notes !== undefined) {
        updates.push('notes = ?');
        values.push(data.notes || null);
      }
      if (data.status !== undefined) {
        updates.push('status = ?');
        values.push(data.status);
      }
      if (data.customer_name !== undefined) {
        updates.push('customer_name = ?');
        values.push(data.customer_name || null);
      }
      if (data.customer_email !== undefined) {
        updates.push('customer_email = ?');
        values.push(data.customer_email || null);
      }
      if (data.customer_phone !== undefined) {
        updates.push('customer_phone = ?');
        values.push(data.customer_phone || null);
      }
      if (data.service_type !== undefined) {
        updates.push('service_type = ?');
        values.push(data.service_type || null);
      }
      if (data.admin_comments !== undefined) {
        updates.push('admin_comments = ?');
        values.push(data.admin_comments || null);
      }

      if (updates.length === 0) {
        return new Response(
          JSON.stringify({ error: 'No fields to update' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Add id to values array
      values.push(id);

      const query = `UPDATE bookings SET ${updates.join(', ')} WHERE id = ?`;
      await this.db.prepare(query).bind(...values).run();

      // If status changed, send notification to customer
      if (data.status) {
        const bookingDetails = await this.db.prepare(`
          SELECT 
            b.*,
            bs.name as business_name, bs.address as business_address, bs.phone as business_phone
          FROM bookings b
          JOIN businesses bs ON b.business_id = bs.id
          WHERE b.id = ?
        `).bind(id).first();

        if (bookingDetails && (bookingDetails.customer_email || bookingDetails.customer_phone)) {
          this.notificationService.notifyBookingStatusChange(
            bookingDetails,
            {
              name: bookingDetails.business_name,
              address: bookingDetails.business_address,
              phone: bookingDetails.business_phone
            },
            {
              name: bookingDetails.customer_name,
              email: bookingDetails.customer_email,
              phone: bookingDetails.customer_phone
            },
            data.status,
            data.admin_comments || null
          ).catch(err => console.error('Notification error:', err));
        }
      }

      return new Response(
        JSON.stringify({ message: 'Booking updated successfully' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  async delete(id) {
    try {
      await this.db.prepare('DELETE FROM bookings WHERE id = ?').bind(id).run();

      return new Response(
        JSON.stringify({ message: 'Booking deleted successfully' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
}
