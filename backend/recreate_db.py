import os
import time

# Delete the database file first
db_path = 'businessdiary.db'
if os.path.exists(db_path):
    try:
        os.remove(db_path)
        print(f"Deleted {db_path}")
    except Exception as e:
        print(f"Error deleting database: {e}")
        print("Please close any running Flask servers and try again")
        exit(1)

# Now import and create
from app import create_app
from models import db, User
from werkzeug.security import generate_password_hash

# Create new database with updated schema
app = create_app()
with app.app_context():
    db.create_all()
    print("Database recreated successfully with new schema!")
    
    # Create super admin
    super_admin = User(
        username='superadmin',
        email='superadmin@businessdiary.com',
        password=generate_password_hash('Admin@123'),
        full_name='Super Admin',
        role='super_admin',
        is_active=True
    )
    
    db.session.add(super_admin)
    db.session.commit()
    print("Super admin created!")
    print("Username: superadmin@businessdiary.com")
    print("Password: Admin@123")
