export class AreaController {
  constructor(env) {
    this.db = env.DB;
  }

  async getAll(request) {
    try {
      const url = new URL(request.url);
      const state = url.searchParams.get('state');

      let query = 'SELECT * FROM areas';
      const bindings = [];

      if (state) {
        query += ' WHERE state = ?';
        bindings.push(state);
      }

      query += ' ORDER BY state, city, name';

      const areas = await this.db.prepare(query).bind(...bindings).all();

      return new Response(
        JSON.stringify({ areas: areas.results }),
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
      const { name, city, state, pincode } = await request.json();

      const result = await this.db.prepare(
        'INSERT INTO areas (name, city, state, pincode) VALUES (?, ?, ?, ?)'
      ).bind(name, city, state, pincode).run();

      const area = await this.db.prepare(
        'SELECT * FROM areas WHERE id = ?'
      ).bind(result.meta.last_row_id).first();

      return new Response(
        JSON.stringify({ area }),
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
      const area = await this.db.prepare(
        'SELECT * FROM areas WHERE id = ?'
      ).bind(id).first();

      if (!area) {
        return new Response(
          JSON.stringify({ error: 'Area not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ area }),
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
      const { name, city, state, pincode } = await request.json();

      await this.db.prepare(
        'UPDATE areas SET name = ?, city = ?, state = ?, pincode = ? WHERE id = ?'
      ).bind(name, city, state, pincode, id).run();

      return new Response(
        JSON.stringify({ message: 'Area updated successfully' }),
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
      await this.db.prepare('DELETE FROM areas WHERE id = ?').bind(id).run();

      return new Response(
        JSON.stringify({ message: 'Area deleted successfully' }),
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
