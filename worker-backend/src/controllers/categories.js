export class CategoryController {
  constructor(env) {
    this.db = env.DB;
  }

  async getAll(request) {
    try {
      const url = new URL(request.url);
      const includeSubcategories = url.searchParams.get('include_subcategories') === 'true';

      const categories = await this.db.prepare(
        'SELECT * FROM categories ORDER BY name'
      ).all();

      if (includeSubcategories) {
        for (const category of categories.results) {
          const subcategories = await this.db.prepare(
            'SELECT * FROM subcategories WHERE category_id = ? ORDER BY name'
          ).bind(category.id).all();
          category.subcategories = subcategories.results;
        }
      }

      return new Response(
        JSON.stringify({ categories: categories.results }),
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
      const { name, description, icon } = await request.json();

      const result = await this.db.prepare(
        'INSERT INTO categories (name, description, icon) VALUES (?, ?, ?)'
      ).bind(name, description, icon).run();

      const category = await this.db.prepare(
        'SELECT * FROM categories WHERE id = ?'
      ).bind(result.meta.last_row_id).first();

      return new Response(
        JSON.stringify({ category }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  async getSubcategories(categoryId) {
    try {
      const subcategories = await this.db.prepare(
        'SELECT * FROM subcategories WHERE category_id = ? ORDER BY name'
      ).bind(categoryId).all();

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
}
