import os
from datetime import timedelta

class Config:
    # Database configuration
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    
    # Use PostgreSQL in production, SQLite in development
    DATABASE_URL = os.environ.get('DATABASE_URL')
    if DATABASE_URL:
        # Render uses postgres:// but SQLAlchemy needs postgresql://
        if DATABASE_URL.startswith('postgres://'):
            DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
        SQLALCHEMY_DATABASE_URI = DATABASE_URL
    else:
        SQLALCHEMY_DATABASE_URI = f'sqlite:///{os.path.join(BASE_DIR, "businessdiary.db")}'
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-change-in-production'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-change-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # Application configuration
    DEBUG = os.environ.get('FLASK_ENV') != 'production'
    TESTING = False
