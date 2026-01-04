from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db
from routes.auth import auth_bp
from routes.users import users_bp
from routes.businesses import businesses_bp
from routes.areas import areas_bp
from routes.categories import categories_bp
from routes.bookings import bookings_bp
from routes.subcategories import subcategories_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Initialize database
    db.init_app(app)
    
    # Root route
    @app.route('/')
    def home():
        return jsonify({
            'message': 'Business Directory API',
            'status': 'running',
            'version': '1.0.0',
            'endpoints': {
                'auth': '/api/auth',
                'users': '/api/users',
                'businesses': '/api/businesses',
                'areas': '/api/areas',
                'categories': '/api/categories',
                'subcategories': '/api/subcategories',
                'bookings': '/api/bookings'
            }
        })
    
    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        return jsonify({'status': 'healthy', 'database': 'connected'})
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(businesses_bp, url_prefix='/api/businesses')
    app.register_blueprint(areas_bp, url_prefix='/api/areas')
    app.register_blueprint(categories_bp, url_prefix='/api/categories')
    app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
    app.register_blueprint(subcategories_bp, url_prefix='/api/subcategories')
    
    # Create tables
    with app.app_context():
        db.create_all()
        # Create default super admin if not exists
        from models import User
        from werkzeug.security import generate_password_hash
        
        super_admin = User.query.filter_by(email='superadmin@businessdiary.com').first()
        if not super_admin:
            super_admin = User(
                email='superadmin@businessdiary.com',
                username='superadmin',
                password=generate_password_hash('Admin@123'),
                full_name='Super Admin',
                role='super_admin',
                is_active=True
            )
            db.session.add(super_admin)
            db.session.commit()
            print("Default Super Admin created!")
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
