from app import create_app
from models import db

app = create_app()

with app.app_context():
    print("Adding subcategory_id column to businesses table...")
    
    try:
        # Add the subcategory_id column
        db.session.execute(db.text('''
            ALTER TABLE businesses 
            ADD COLUMN subcategory_id INTEGER REFERENCES subcategories(id)
        '''))
        db.session.commit()
        print("✅ Successfully added subcategory_id column!")
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Note: Column might already exist or there's a syntax issue")
        db.session.rollback()
