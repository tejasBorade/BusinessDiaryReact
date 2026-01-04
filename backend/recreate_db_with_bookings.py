"""
Recreate database with bookings table
Run this script to add the bookings table to the database
"""
import os
from app import create_app
from models import db

def recreate_database():
    app = create_app()
    
    with app.app_context():
        # Drop all tables
        print("Dropping all tables...")
        db.drop_all()
        
        # Create all tables
        print("Creating all tables with bookings...")
        db.create_all()
        
        print("Database recreated successfully with bookings table!")
        print("\nNOTE: You need to re-populate your data:")
        print("1. Run populate_data.py to add categories, areas, and businesses")
        print("2. Or manually add your data through the application")

if __name__ == '__main__':
    # Confirm before proceeding
    print("WARNING: This will delete all existing data!")
    response = input("Are you sure you want to recreate the database? (yes/no): ")
    
    if response.lower() == 'yes':
        recreate_database()
    else:
        print("Operation cancelled.")
