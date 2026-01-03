from app import create_app
from models import db, Category

app = create_app()

with app.app_context():
    # Check if categories already exist
    existing_categories = Category.query.all()
    print(f"Existing categories: {[c.name for c in existing_categories]}")
    
    # Define new categories with details
    new_categories = [
        {
            'name': 'Fitness',
            'description': 'Gyms, yoga studios, fitness centers, personal trainers, and wellness facilities',
            'icon': '💪'
        },
        {
            'name': 'Restaurant',
            'description': 'Restaurants, cafes, food courts, bakeries, and dining establishments',
            'icon': '🍽️'
        },
        {
            'name': 'Doctors',
            'description': 'Medical practitioners, clinics, hospitals, specialists, and healthcare providers',
            'icon': '👨‍⚕️'
        },
        {
            'name': 'Automobile',
            'description': 'Car dealers, repair shops, service centers, spare parts, and automotive services',
            'icon': '🚗'
        },
        {
            'name': 'Tutors',
            'description': 'Private tutors, coaching centers, educational institutes, and learning centers',
            'icon': '📚'
        }
    ]
    
    # Add categories to database
    added_count = 0
    for cat_data in new_categories:
        # Check if category already exists
        existing = Category.query.filter_by(name=cat_data['name']).first()
        if not existing:
            category = Category(
                name=cat_data['name'],
                description=cat_data['description'],
                icon=cat_data['icon'],
                is_active=True
            )
            db.session.add(category)
            added_count += 1
            print(f"✓ Added category: {cat_data['name']} {cat_data['icon']}")
        else:
            print(f"✗ Category already exists: {cat_data['name']}")
    
    # Commit changes
    if added_count > 0:
        db.session.commit()
        print(f"\n✅ Successfully added {added_count} new categories!")
    else:
        print("\n⚠️ No new categories added (all already exist)")
    
    # Display all categories
    all_categories = Category.query.all()
    print(f"\nTotal categories in database: {len(all_categories)}")
    for cat in all_categories:
        print(f"  • {cat.icon} {cat.name} - {cat.description}")
