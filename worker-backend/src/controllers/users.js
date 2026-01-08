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

  async getStats(request) {
    try {
      const stats = await this.db.prepare(
        'SELECT role, COUNT(*) as count FROM users GROUP BY role'
      ).all();

      return new Response(
        JSON.stringify({ stats: stats.results }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
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
      const user = await this.db.prepare(
        'SELECT id, email, full_name, phone, role, is_active, created_at FROM users WHERE id = ?'
      ).bind(id).first();

      if (!user) {
        return new Response(
          JSON.stringify({ error: 'User not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ user }),
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
      const { full_name, phone, role, is_active } = await request.json();

      await this.db.prepare(
        'UPDATE users SET full_name = ?, phone = ?, role = ?, is_active = ? WHERE id = ?'
      ).bind(full_name, phone, role, is_active, id).run();

      return new Response(
        JSON.stringify({ message: 'User updated successfully' }),
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
      await this.db.prepare('DELETE FROM users WHERE id = ?').bind(id).run();

      return new Response(
        JSON.stringify({ message: 'User deleted successfully' }),
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
