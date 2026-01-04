"""
WSGI Entry Point for Production Deployment
This file is used by Gunicorn to run the Flask application
"""
import os
from app import create_app

# Set environment to production
os.environ['FLASK_ENV'] = 'production'

# Create Flask application
app = create_app()

if __name__ == "__main__":
    # This is only used when running directly with Python (not recommended for production)
    # In production, use Gunicorn: gunicorn -c gunicorn_config.py wsgi:app
    app.run(host='0.0.0.0', port=5000)
