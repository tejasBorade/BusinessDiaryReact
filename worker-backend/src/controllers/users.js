export class UserController {
  constructor(env) {
    this.db = env.DB;
  }

  async getAll(request) {
    try {
      const url = new URL(request.url);
      const role = url.searchParams.get('role');

      let query = 'SELECT id, email, full_name, phone, role, is_active, created_at FROM users';
      const bindings = [];

      if (role) {
        query += ' WHERE role = ?';
        bindings.push(role);
      }

      query += ' ORDER BY created_at DESC';

      const users = await this.db.prepare(query).bind(...bindings).all();

      return new Response(
        JSON.stringify({ users: users.results }),
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
