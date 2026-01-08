export class SubcategoryController {
  constructor(env) {
    this.db = env.DB;
  }

  async getAll(request) {
    try {
      const url = new URL(request.url);
      const categoryId = url.searchParams.get('category_id');

      let query = 'SELECT * FROM subcategories';
      const bindings = [];

      if (categoryId) {
        query += ' WHERE category_id = ?';
        bindings.push(categoryId);
      }

      query += ' ORDER BY name';

      const subcategories = await this.db.prepare(query).bind(...bindings).all();

      return new Response(
        JSON.stringify({ subcategories: subcategories.results }),
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
      const subcategory = await this.db.prepare(
        'SELECT * FROM subcategories WHERE id = ?'
      ).bind(id).first();

      if (!subcategory) {
        return new Response(
          JSON.stringify({ error: 'Subcategory not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ subcategory }),
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
      const { name, description, category_id } = await request.json();

      const result = await this.db.prepare(
        'INSERT INTO subcategories (name, description, category_id) VALUES (?, ?, ?)'
      ).bind(name, description, category_id).run();

      const subcategory = await this.db.prepare(
        'SELECT * FROM subcategories WHERE id = ?'
      ).bind(result.meta.last_row_id).first();

      return new Response(
        JSON.stringify({ subcategory }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
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
      const { name, description, category_id } = await request.json();

      await this.db.prepare(
        'UPDATE subcategories SET name = ?, description = ?, category_id = ? WHERE id = ?'
      ).bind(name, description, category_id, id).run();

      return new Response(
        JSON.stringify({ message: 'Subcategory updated successfully' }),
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
      await this.db.prepare('DELETE FROM subcategories WHERE id = ?').bind(id).run();

      return new Response(
        JSON.stringify({ message: 'Subcategory deleted successfully' }),
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
