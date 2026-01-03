from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from routes.auth import auth_bp
from routes.users import users_bp
from routes.businesses import businesses_bp
from routes.areas import areas_bp
from routes.categories import categories_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Initialize database
    db.init_app(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(businesses_bp, url_prefix='/api/businesses')
    app.register_blueprint(areas_bp, url_prefix='/api/areas')
    app.register_blueprint(categories_bp, url_prefix='/api/categories')
    
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
