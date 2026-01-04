from app import create_app
from models import db, Area, Category, Business, User

app = create_app()

with app.app_context():
    # Get the super admin user (owner)
    owner = User.query.filter_by(role='super_admin').first()
    if not owner:
        print("❌ Error: No super admin user found.")
        exit()
    
    print(f"Using owner: {owner.email} (ID: {owner.id})")
    
    # Add Aurangabad area if it doesn't exist
    area = Area.query.filter_by(name='Aurangabad', city='Aurangabad').first()
    if not area:
        area = Area(
            name='Aurangabad',
            city='Aurangabad',
            state='Maharashtra',
            pincode='431001',
            description='Historic city known for Ajanta and Ellora Caves',
            is_active=True
        )
        db.session.add(area)
        db.session.commit()
        print(f"✓ Added area: Aurangabad, Maharashtra")
    else:
        print(f"✓ Area already exists: Aurangabad, Maharashtra")
    
    # Get Photo Studio category
    category = Category.query.filter_by(name='Photo Studio').first()
    if not category:
        print("❌ Error: Photo Studio category not found. Please add it first.")
        exit()
    
    print(f"✓ Found category: {category.name}")
    
    # Check if business already exists
    existing = Business.query.filter_by(name='Pixel Town Photo Studio', area_id=area.id).first()
    if existing:
        print(f"✗ Business already exists: Pixel Town Photo Studio")
    else:
        # Add Pixel Town Photo Studio
        business = Business(
            name='Pixel Town Photo Studio',
            description='Professional photography studio specializing in wedding photography, pre-wedding shoots, candid photography, portrait sessions, baby shoots, and event coverage. We offer state-of-the-art equipment, creative lighting setups, and experienced photographers to capture your special moments. Also provide photo editing, album design, and video editing services.',
            address='Shop No. 15, Satara Parisar, Near TV Center, Jalna Road',
            phone='+91 240 2335678',
            email='info@pixeltown.in',
            website='https://pixeltown.in',
            opening_hours='Mon-Sat: 10:00 AM - 8:00 PM, Sun: 11:00 AM - 6:00 PM',
            image_url='https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=500',
            rating=4.6,
            category_id=category.id,
            area_id=area.id,
            owner_id=owner.id,
            is_active=True,
            is_verified=True
        )
        db.session.add(business)
        db.session.commit()
        print(f"✓ Added business: Pixel Town Photo Studio in Aurangabad, Maharashtra")
        print(f"  📍 Address: {business.address}")
        print(f"  📞 Phone: {business.phone}")
        print(f"  ⭐ Rating: {business.rating}")
        print(f"  🏷️ Category: {category.name}")
    
    print("\n✅ Operation completed successfully!")
    
    # Display summary
    total_businesses = Business.query.filter_by(area_id=area.id).count()
    print(f"\nTotal businesses in Aurangabad: {total_businesses}")
