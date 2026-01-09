export class BookingController {
  constructor(env) {
    this.db = env.DB;
  }

  async getAll(request) {
    try {
      const bookings = await this.db.prepare(`
        SELECT 
          b.*,
          bs.id as business_id,
          bs.name as business_name,
          bs.address as business_address,
          bs.phone as business_phone,
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
        ORDER BY b.created_at DESC
      `).all();

      // Transform the flat data into nested structure
      const transformedBookings = bookings.results.map(row => ({
        id: row.id,
        business_id: row.business_id,
        user_id: row.user_id,
        booking_date: row.booking_date,
        booking_time: row.booking_time,
        status: row.status,
        notes: row.notes,
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
      const { booking_date, booking_time, notes, status } = await request.json();

      await this.db.prepare(
        'UPDATE bookings SET booking_date = ?, booking_time = ?, notes = ?, status = ? WHERE id = ?'
      ).bind(booking_date, booking_time, notes, status, id).run();

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
