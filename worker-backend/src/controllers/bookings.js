export class BookingController {
  constructor(env) {
    this.db = env.DB;
  }

  async getAll(request) {
    try {
      const bookings = await this.db.prepare(
        'SELECT * FROM bookings ORDER BY created_at DESC'
      ).all();

      return new Response(
        JSON.stringify({ bookings: bookings.results }),
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
