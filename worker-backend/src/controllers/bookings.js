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
      const { business_id, user_id, booking_date, booking_time, notes } = await request.json();

      const result = await this.db.prepare(
        'INSERT INTO bookings (business_id, user_id, booking_date, booking_time, notes) VALUES (?, ?, ?, ?, ?)'
      ).bind(business_id, user_id, booking_date, booking_time, notes).run();

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
}
