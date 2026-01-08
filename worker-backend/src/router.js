import { AuthController } from './controllers/auth';
import { CategoryController } from './controllers/categories';
import { SubcategoryController } from './controllers/subcategories';
import { BusinessController } from './controllers/businesses';
import { AreaController } from './controllers/areas';
import { BookingController } from './controllers/bookings';
import { UserController } from './controllers/users';

export class Router {
  constructor(env) {
    this.env = env;
    this.authController = new AuthController(env);
    this.categoryController = new CategoryController(env);
    this.subcategoryController = new SubcategoryController(env);
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
    if (path === '/api/auth/verify' && method === 'GET') {
      return this.authController.verify(request);
    }

    // Categories routes
    if (path === '/api/categories' && method === 'GET') {
      return this.categoryController.getAll(request);
    }
    if (path === '/api/categories' && method === 'POST') {
      return this.categoryController.create(request);
    }

    // Subcategories routes
    if (path === '/api/subcategories' && method === 'GET') {
      return this.subcategoryController.getAll(request);
    }
    if (path === '/api/subcategories' && method === 'POST') {
      return this.subcategoryController.create(request);
    }
    if (path.match(/^\/api\/subcategories\/\d+$/) && method === 'GET') {
      const id = path.split('/').pop();
      return this.subcategoryController.getById(id);
    }
    if (path.match(/^\/api\/subcategories\/\d+$/) && method === 'PUT') {
      const id = path.split('/').pop();
      return this.subcategoryController.update(request, id);
    }
    if (path.match(/^\/api\/subcategories\/\d+$/) && method === 'DELETE') {
      const id = path.split('/').pop();
      return this.subcategoryController.delete(id);
    }
    if (path.match(/^\/api\/subcategories\/category\/\d+$/) && method === 'GET') {
      const categoryId = path.split('/').pop();
      return this.categoryController.getSubcategories(categoryId);
    }

    // Businesses routes
    if (path === '/api/businesses/my' && method === 'GET') {
      return this.businessController.getMyBusinesses(request);
    }
    if (path === '/api/businesses' && method === 'GET') {
      return this.businessController.getAll(request);
    }
    if (path === '/api/businesses' && method === 'POST') {
      return this.businessController.create(request);
    }
    // Uncomment when R2 is enabled
    // if (path === '/api/businesses/upload-image' && method === 'POST') {
    //   return this.businessController.uploadImage(request);
    // }
    if (path.match(/^\/api\/businesses\/\d+$/) && method === 'GET') {
      const id = path.split('/').pop();
      return this.businessController.getById(id);
    }
    if (path.match(/^\/api\/businesses\/\d+$/) && method === 'PUT') {
      const id = path.split('/').pop();
      return this.businessController.update(request, id);
    }
    if (path.match(/^\/api\/businesses\/\d+$/) && method === 'DELETE') {
      const id = path.split('/').pop();
      return this.businessController.delete(id);
    }
    if (path.match(/^\/api\/businesses\/\d+\/rate$/) && method === 'POST') {
      const id = path.split('/')[3];
      return this.businessController.rate(request, id);
    }
    if (path.match(/^\/api\/businesses\/\d+\/reviews$/) && method === 'POST') {
      const id = path.split('/')[3];
      return this.businessController.addReview(request, id);
    }

    // Areas routes
    if (path === '/api/areas' && method === 'GET') {
      return this.areaController.getAll(request);
    }
    if (path === '/api/areas' && method === 'POST') {
      return this.areaController.create(request);
    }
    if (path.match(/^\/api\/areas\/\d+$/) && method === 'GET') {
      const id = path.split('/').pop();
      return this.areaController.getById(id);
    }
    if (path.match(/^\/api\/areas\/\d+$/) && method === 'PUT') {
      const id = path.split('/').pop();
      return this.areaController.update(request, id);
    }
    if (path.match(/^\/api\/areas\/\d+$/) && method === 'DELETE') {
      const id = path.split('/').pop();
      return this.areaController.delete(id);
    }

    // Categories routes
    if (path.match(/^\/api\/categories\/\d+$/) && method === 'GET') {
      const id = path.split('/').pop();
      return this.categoryController.getById(id);
    }
    if (path.match(/^\/api\/categories\/\d+$/) && method === 'PUT') {
      const id = path.split('/').pop();
      return this.categoryController.update(request, id);
    }
    if (path.match(/^\/api\/categories\/\d+$/) && method === 'DELETE') {
      const id = path.split('/').pop();
      return this.categoryController.delete(id);
    }

    // Image serving route (requires R2 enabled)
    // if (path.match(/^\/images\/.+$/) && method === 'GET') {
    //   const filename = path.split('/images/')[1];
    //   return this.serveImage(filename);
    // }

    // Bookings routes
    if (path === '/api/bookings' && method === 'GET') {
      return this.bookingController.getAll(request);
    }
    if (path === '/api/bookings' && method === 'POST') {
      return this.bookingController.create(request);
    }
    if (path.match(/^\/api\/bookings\/\d+$/) && method === 'GET') {
      const id = path.split('/').pop();
      return this.bookingController.getById(id);
    }
    if (path.match(/^\/api\/bookings\/\d+$/) && method === 'PUT') {
      const id = path.split('/').pop();
      return this.bookingController.update(request, id);
    }
    if (path.match(/^\/api\/bookings\/\d+$/) && method === 'DELETE') {
      const id = path.split('/').pop();
      return this.bookingController.delete(id);
    }

    // Users routes
    if (path === '/api/users' && method === 'GET') {
      return this.userController.getAll(request);
    }
    if (path === '/api/users/stats' && method === 'GET') {
      return this.userController.getStats(request);
    }
    if (path.match(/^\/api\/users\/\d+$/) && method === 'GET') {
      const id = path.split('/').pop();
      return this.userController.getById(id);
    }
    if (path.match(/^\/api\/users\/\d+$/) && method === 'PUT') {
      const id = path.split('/').pop();
      return this.userController.update(request, id);
    }
    if (path.match(/^\/api\/users\/\d+$/) && method === 'DELETE') {
      const id = path.split('/').pop();
      return this.userController.delete(id);
    }

    return new Response('Not Found', { status: 404 });
  }

  // Uncomment when R2 is enabled
  // async serveImage(filename) {
  //   try {
  //     const object = await this.env.IMAGES.get(filename);
  //     
  //     if (!object) {
  //       return new Response('Image not found', { status: 404 });
  //     }

  //     const headers = new Headers();
  //     object.writeHttpMetadata(headers);
  //     headers.set('etag', object.httpEtag);
  //     headers.set('cache-control', 'public, max-age=31536000');

  //     return new Response(object.body, { headers });
  //   } catch (error) {
  //     return new Response('Error serving image', { status: 500 });
  //   }
  // }
}
