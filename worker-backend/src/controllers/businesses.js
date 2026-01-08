export class BusinessController {
  constructor(env) {
    this.db = env.DB;
    this.images = env.IMAGES;
    this.env = env;
  }

  async uploadImage(request) {
    try {
      const formData = await request.formData();
      const file = formData.get('image');
      
      if (!file) {
        return new Response(
          JSON.stringify({ error: 'No image provided' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Generate unique filename
      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      const filename = `business-${timestamp}.${extension}`;

      // Upload to R2
      await this.images.put(filename, file.stream(), {
        httpMetadata: {
          contentType: file.type,
        },
      });

      const imageUrl = `/images/${filename}`;

      return new Response(
        JSON.stringify({ imageUrl }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  async getAll(request) {
    try {
      const url = new URL(request.url);
      const search = url.searchParams.get('search');
      const categoryId = url.searchParams.get('category_id');
      const subcategoryId = url.searchParams.get('subcategory_id');
      const areaId = url.searchParams.get('area_id');
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = 20;
      const offset = (page - 1) * limit;

      let query = 'SELECT * FROM businesses WHERE is_active = 1';
      const bindings = [];

      if (search) {
        query += ' AND (name LIKE ? OR description LIKE ?)';
        bindings.push(`%${search}%`, `%${search}%`);
      }
      if (categoryId) {
        query += ' AND category_id = ?';
        bindings.push(categoryId);
      }
      if (subcategoryId) {
        query += ' AND subcategory_id = ?';
        bindings.push(subcategoryId);
      }
      if (areaId) {
        query += ' AND area_id = ?';
        bindings.push(areaId);
      }

      query += ' ORDER BY rating DESC, name LIMIT ? OFFSET ?';
      bindings.push(limit, offset);

      const businesses = await this.db.prepare(query).bind(...bindings).all();

      return new Response(
        JSON.stringify({ businesses: businesses.results }),
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
      const business = await this.db.prepare(
        'SELECT * FROM businesses WHERE id = ?'
      ).bind(id).first();

      if (!business) {
        return new Response(
          JSON.stringify({ error: 'Business not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ business }),
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
      
      const result = await this.db.prepare(
        `INSERT INTO businesses 
        (name, description, address, phone, email, website, image_url, category_id, subcategory_id, area_id, owner_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        data.name, data.description, data.address, data.phone, 
        data.email, data.website, data.image_url || null, data.category_id, data.subcategory_id,
        data.area_id, data.owner_id
      ).run();

      const business = await this.db.prepare(
        'SELECT * FROM businesses WHERE id = ?'
      ).bind(result.meta.last_row_id).first();

      return new Response(
        JSON.stringify({ business }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  async rate(request, businessId) {
    try {
      const { rating } = await request.json();

      const business = await this.db.prepare(
        'SELECT total_ratings, rating FROM businesses WHERE id = ?'
      ).bind(businessId).first();

      if (!business) {
        return new Response(
          JSON.stringify({ error: 'Business not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const newTotal = business.total_ratings + 1;
      const newRating = ((business.rating * business.total_ratings) + rating) / newTotal;

      await this.db.prepare(
        'UPDATE businesses SET rating = ?, total_ratings = ? WHERE id = ?'
      ).bind(newRating, newTotal, businessId).run();

      return new Response(
        JSON.stringify({ message: 'Rating submitted successfully' }),
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
