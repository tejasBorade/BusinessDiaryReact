"""
Production Configuration
Use this configuration for production deployment
"""
import os
from datetime import timedelta

class ProductionConfig:
    """Production configuration"""
    
    # CRITICAL: Change these values for production
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'CHANGE-THIS-TO-RANDOM-SECRET-KEY'
    
    # Database Configuration
    # Replace with your production database URL
    # Format: postgresql://username:password@host:port/database_name
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'postgresql://dbuser:your_password@localhost:5432/businessdiary_prod'
    
    # If using MySQL instead:
    # SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://user:password@localhost/businessdiary_prod'
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False  # Disable SQL logging in production
    
    # Security Settings
    DEBUG = False
    TESTING = False
    
    # CORS Settings - Update with your actual domain
    CORS_ORIGINS = [
        'https://yourdomain.com',
        'https://www.yourdomain.com',
    ]
    
    # Session Configuration
    SESSION_COOKIE_SECURE = True  # Only send cookies over HTTPS
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    
    # JWT Configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or SECRET_KEY
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # Email Configuration (for booking notifications)
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER', 'noreply@yourdomain.com')
    
    # SMS Configuration (if using SMS notifications)
    SMS_API_KEY = os.environ.get('SMS_API_KEY')
    SMS_SENDER_ID = os.environ.get('SMS_SENDER_ID')
    
    # File Upload Configuration
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    
    # Logging
    LOG_TO_STDOUT = os.environ.get('LOG_TO_STDOUT', False)
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    
    # Rate Limiting (optional but recommended)
    RATELIMIT_ENABLED = True
    RATELIMIT_STORAGE_URL = os.environ.get('REDIS_URL', 'memory://')
    
    # Server Configuration
    SERVER_NAME = os.environ.get('SERVER_NAME')  # e.g., 'yourdomain.com'
    PREFERRED_URL_SCHEME = 'https'


# Generate a secure SECRET_KEY
# Run this in Python shell and copy the output:
# import secrets
# print(secrets.token_hex(32))
