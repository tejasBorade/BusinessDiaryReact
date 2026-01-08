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

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
