import { AuthController } from './controllers/auth';
import { CategoryController } from './controllers/categories';
import { BusinessController } from './controllers/businesses';
import { AreaController } from './controllers/areas';
import { BookingController } from './controllers/bookings';
import { UserController } from './controllers/users';

export class Router {
  constructor(env) {
    this.env = env;
    this.authController = new AuthController(env);
    this.categoryController = new CategoryController(env);
    this.businessController = new BusinessController(env);
    this.areaController = new AreaController(env);
    this.bookingController = new BookingController(env);
    this.userController = new UserController(env);
  }

  async handle(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Auth routes
    if (path === '/api/auth/login' && method === 'POST') {
      return this.authController.login(request);
    }
    if (path === '/api/auth/register' && method === 'POST') {
      return this.authController.register(request);
    }

    // Categories routes
    if (path === '/api/categories' && method === 'GET') {
      return this.categoryController.getAll(request);
    }
    if (path === '/api/categories' && method === 'POST') {
      return this.categoryController.create(request);
    }

    // Subcategories routes
    if (path.match(/^\/api\/subcategories\/category\/\d+$/) && method === 'GET') {
      const categoryId = path.split('/').pop();
      return this.categoryController.getSubcategories(categoryId);
    }

    // Businesses routes
    if (path === '/api/businesses' && method === 'GET') {
      return this.businessController.getAll(request);
    }
    if (path === '/api/businesses' && method === 'POST') {
      return this.businessController.create(request);
    }
    if (path === '/api/businesses/upload-image' && method === 'POST') {
      return this.businessController.uploadImage(request);
    }
    if (path.match(/^\/api\/businesses\/\d+$/) && method === 'GET') {
      const id = path.split('/').pop();
      return this.businessController.getById(id);
    }
    if (path.match(/^\/api\/businesses\/\d+\/rate$/) && method === 'POST') {
      const id = path.split('/')[3];
      return this.businessController.rate(request, id);
    }

    // Areas routes
    if (path === '/api/areas' && method === 'GET') {
      return this.areaController.getAll(request);
    }
    if (path === '/api/areas' && method === 'POST') {
      return this.areaController.create(request);
    }

    // Image serving route
    if (path.match(/^\/images\/.+$/) && method === 'GET') {
      const filename = path.split('/images/')[1];
      return this.serveImage(filename);
    }

    // Bookings routes
    if (path === '/api/bookings' && method === 'GET') {
      return this.bookingController.getAll(request);
    }
    if (path === '/api/bookings' && method === 'POST') {
      return this.bookingController.create(request);
    }

    // Users routes
    if (path === '/api/users' && method === 'GET') {
      return this.userController.getAll(request);
    }

    return new Response('Not Found', { status: 404 });
  }

  async serveImage(filename) {
    try {
      const object = await this.env.IMAGES.get(filename);
      
      if (!object) {
        return new Response('Image not found', { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);
      headers.set('cache-control', 'public, max-age=31536000');

      return new Response(object.body, { headers });
    } catch (error) {
      return new Response('Error serving image', { status: 500 });
    }
  }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
