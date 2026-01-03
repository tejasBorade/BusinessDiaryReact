from app import create_app
from models import db, Area, Category, Business, User
from datetime import datetime

app = create_app()

with app.app_context():
    # Get the super admin user (owner_id will be 1)
    owner = User.query.filter_by(role='super_admin').first()
    if not owner:
        print("❌ Error: No super admin user found. Please create a user first.")
        exit()
    
    print(f"Using owner: {owner.email} (ID: {owner.id})")
    
    # ========== ADD AREAS ==========
    print("\n📍 Adding Areas...")
    areas_data = [
        {'name': 'Koramangala', 'city': 'Bangalore', 'state': 'Karnataka', 'pincode': '560034', 'description': 'Popular residential and commercial area'},
        {'name': 'Andheri West', 'city': 'Mumbai', 'state': 'Maharashtra', 'pincode': '400058', 'description': 'Business hub with shopping and entertainment'},
        {'name': 'Connaught Place', 'city': 'Delhi', 'state': 'Delhi', 'pincode': '110001', 'description': 'Central business district'},
        {'name': 'Banjara Hills', 'city': 'Hyderabad', 'state': 'Telangana', 'pincode': '500034', 'description': 'Upscale commercial and residential area'},
        {'name': 'Anna Nagar', 'city': 'Chennai', 'state': 'Tamil Nadu', 'pincode': '600040', 'description': 'Residential area with commercial establishments'}
    ]
    
    areas = []
    for area_data in areas_data:
        existing = Area.query.filter_by(name=area_data['name'], city=area_data['city']).first()
        if not existing:
            area = Area(**area_data, is_active=True)
            db.session.add(area)
            areas.append(area)
            print(f"✓ Added: {area_data['name']}, {area_data['city']}")
        else:
            areas.append(existing)
            print(f"✗ Already exists: {area_data['name']}, {area_data['city']}")
    
    db.session.commit()
    print(f"✅ Total areas: {len(areas)}")
    
    # ========== GET CATEGORIES ==========
    print("\n📂 Fetching Categories...")
    categories = {
        'Fitness': Category.query.filter_by(name='Fitness').first(),
        'Restaurant': Category.query.filter_by(name='Restaurant').first(),
        'Doctors': Category.query.filter_by(name='Doctors').first(),
        'Automobile': Category.query.filter_by(name='Automobile').first(),
        'Tutors': Category.query.filter_by(name='Tutors').first(),
    }
    
    for cat_name, cat_obj in categories.items():
        if cat_obj:
            print(f"✓ Found: {cat_name}")
        else:
            print(f"❌ Missing: {cat_name}")
    
    # ========== ADD BUSINESSES ==========
    print("\n🏢 Adding Businesses...")
    
    businesses_data = [
        # FITNESS (4 businesses)
        {
            'name': 'Gold\'s Gym',
            'description': 'Premium fitness center with state-of-the-art equipment, personal trainers, and group classes including yoga, Zumba, and CrossFit',
            'category': 'Fitness',
            'area': 0,  # Koramangala
            'address': '45, 5th Block, Koramangala',
            'phone': '+91 80 4567 8900',
            'email': 'koramangala@goldsgym.in',
            'website': 'https://goldsgym.in',
            'image_url': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500',
            'rating': 4.5
        },
        {
            'name': 'Cult.fit Studio',
            'description': 'Modern fitness studio offering strength training, cardio, yoga, dance fitness, and wellness programs',
            'category': 'Fitness',
            'area': 1,  # Andheri West
            'address': 'Infiniti Mall, New Link Road, Andheri West',
            'phone': '+91 22 6789 0123',
            'email': 'andheri@cult.fit',
            'website': 'https://cult.fit',
            'image_url': 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500',
            'rating': 4.7
        },
        {
            'name': 'Fitness First',
            'description': 'International fitness chain with swimming pool, spa, personal training, and group exercise classes',
            'category': 'Fitness',
            'area': 2,  # Connaught Place
            'address': 'Palika Bazaar, Connaught Place',
            'phone': '+91 11 4567 8900',
            'email': 'delhi@fitnessfirst.in',
            'website': 'https://fitnessfirst.in',
            'image_url': 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=500',
            'rating': 4.3
        },
        {
            'name': 'Talwalkars Gym',
            'category': 'Fitness',
            'description': 'Well-established fitness chain with professional trainers, modern equipment, and flexible membership plans',
            'area': 3,  # Banjara Hills
            'address': 'Road No. 12, Banjara Hills',
            'phone': '+91 40 6789 0123',
            'email': 'hyderabad@talwalkars.net',
            'website': 'https://talwalkars.net',
            'image_url': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500',
            'rating': 4.4
        },
        
        # RESTAURANT (4 businesses)
        {
            'name': 'The Spice Route',
            'category': 'Restaurant',
            'description': 'Fine dining restaurant serving authentic Indian cuisine with a modern twist, elegant ambiance, and live music on weekends',
            'area': 0,  # Koramangala
            'address': '123, 80 Feet Road, Koramangala',
            'phone': '+91 80 2345 6789',
            'email': 'reservations@spiceroute.in',
            'website': 'https://spiceroute.in',
            'image_url': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500',
            'rating': 4.6
        },
        {
            'name': 'Cafe Mondegar',
            'category': 'Restaurant',
            'description': 'Iconic cafe known for breakfast, burgers, sandwiches, and continental cuisine in a vintage setting',
            'area': 1,  # Andheri West
            'address': '5, Metro House, Veera Desai Road, Andheri West',
            'phone': '+91 22 2673 0693',
            'email': 'info@cafemondegar.com',
            'website': 'https://cafemondegar.com',
            'image_url': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500',
            'rating': 4.4
        },
        {
            'name': 'Saravana Bhavan',
            'category': 'Restaurant',
            'description': 'Legendary South Indian vegetarian restaurant chain serving authentic dosas, idlis, and traditional meals',
            'area': 2,  # Connaught Place
            'address': 'P-15/90, Connaught Place',
            'phone': '+91 11 4151 2755',
            'email': 'delhi@saravanabhavan.com',
            'website': 'https://saravanabhavan.com',
            'image_url': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500',
            'rating': 4.5
        },
        {
            'name': 'Paradise Biryani',
            'category': 'Restaurant',
            'description': 'Famous for authentic Hyderabadi biryani, kebabs, and Mughlai cuisine. A must-visit for biryani lovers',
            'area': 3,  # Banjara Hills
            'address': 'Road No. 1, Banjara Hills',
            'phone': '+91 40 2339 7920',
            'email': 'info@paradisebiryani.com',
            'website': 'https://paradisebiryani.com',
            'image_url': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500',
            'rating': 4.7
        },
        
        # DOCTORS (4 businesses)
        {
            'name': 'Dr. Sharma Clinic',
            'category': 'Doctors',
            'description': 'General physician with 15+ years experience. Specializes in diabetes, hypertension, and preventive care',
            'area': 0,  # Koramangala
            'address': '67, 1st Cross, Koramangala 4th Block',
            'phone': '+91 80 4123 4567',
            'email': 'drsharma@healthcare.in',
            'website': 'https://drsharma.clinic',
            'image_url': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500',
            'rating': 4.8
        },
        {
            'name': 'HealthCare Multispecialty Clinic',
            'category': 'Doctors',
            'description': 'Modern clinic with specialists in cardiology, dermatology, pediatrics, and general medicine. Lab facilities available',
            'area': 1,  # Andheri West
            'address': 'Lotus Business Park, Andheri West',
            'phone': '+91 22 6789 0123',
            'email': 'contact@healthcareclinic.in',
            'website': 'https://healthcareclinic.in',
            'image_url': 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=500',
            'rating': 4.6
        },
        {
            'name': 'Apollo Clinic',
            'category': 'Doctors',
            'description': 'Part of Apollo Hospitals group. Offers OPD consultations, diagnostics, pharmacy, and minor procedures',
            'area': 4,  # Anna Nagar
            'address': '123, 3rd Avenue, Anna Nagar',
            'phone': '+91 44 2626 2000',
            'email': 'annanagar@apolloclinic.in',
            'website': 'https://apolloclinic.com',
            'image_url': 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500',
            'rating': 4.7
        },
        {
            'name': 'Dr. Reddy\'s Dental Care',
            'category': 'Doctors',
            'description': 'Specialized dental clinic offering root canal, implants, orthodontics, cosmetic dentistry, and pediatric dental care',
            'area': 3,  # Banjara Hills
            'address': '8-2-293/82/A, Road No. 3, Banjara Hills',
            'phone': '+91 40 2354 7890',
            'email': 'info@drreddy dentalcare.com',
            'website': 'https://drreddydentalcare.com',
            'image_url': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500',
            'rating': 4.9
        },
        
        # AUTOMOBILE (3 businesses)
        {
            'name': 'Speed Auto Service Center',
            'category': 'Automobile',
            'description': 'Multi-brand car service center offering routine maintenance, repairs, denting-painting, and insurance claims',
            'area': 0,  # Koramangala
            'address': 'Hosur Road, Near Sony Signal, Koramangala',
            'phone': '+91 80 4567 1234',
            'email': 'service@speedauto.in',
            'website': 'https://speedauto.in',
            'image_url': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500',
            'rating': 4.4
        },
        {
            'name': 'Royal Motors - Maruti Authorized Service',
            'category': 'Automobile',
            'description': 'Authorized Maruti Suzuki service center with genuine spare parts, trained technicians, and warranty support',
            'area': 2,  # Connaught Place
            'address': 'Barakhamba Road, Connaught Place',
            'phone': '+91 11 4567 8900',
            'email': 'delhi@royalmotors.in',
            'website': 'https://royalmotors.in',
            'image_url': 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=500',
            'rating': 4.5
        },
        {
            'name': 'AutoZone Spare Parts',
            'category': 'Automobile',
            'description': 'Comprehensive spare parts store for all car models. Also offers battery replacement, tyre services, and accessories',
            'area': 3,  # Banjara Hills
            'address': 'Road No. 10, Banjara Hills',
            'phone': '+91 40 2335 6789',
            'email': 'sales@autozone.in',
            'website': 'https://autozone.in',
            'image_url': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500',
            'rating': 4.3
        },
        
        # TUTORS (4 businesses)
        {
            'name': 'Brilliant Minds Coaching Center',
            'category': 'Tutors',
            'description': 'Specialized coaching for IIT-JEE, NEET, and board exams. Small batch sizes with experienced faculty',
            'area': 0,  # Koramangala
            'address': '2nd Floor, 7th Block, Koramangala',
            'phone': '+91 80 4123 7890',
            'email': 'admissions@brilliantminds.in',
            'website': 'https://brilliantminds.in',
            'image_url': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500',
            'rating': 4.6
        },
        {
            'name': 'Ace Academy',
            'category': 'Tutors',
            'description': 'Comprehensive coaching for classes 6-12, competitive exams, and skill development programs',
            'area': 1,  # Andheri West
            'address': 'Oshiwara Industrial Center, Andheri West',
            'phone': '+91 22 2634 5678',
            'email': 'info@aceacademy.in',
            'website': 'https://aceacademy.in',
            'image_url': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500',
            'rating': 4.5
        },
        {
            'name': 'English Spoken Classes by Prof. Kumar',
            'category': 'Tutors',
            'description': 'Specialized English speaking and personality development classes. IELTS and TOEFL preparation available',
            'area': 4,  # Anna Nagar
            'address': '45, 2nd Avenue, Anna Nagar',
            'phone': '+91 44 2626 7890',
            'email': 'profkumar@english.in',
            'website': 'https://profkumarenglish.com',
            'image_url': 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=500',
            'rating': 4.7
        },
        {
            'name': 'Music & Arts Academy',
            'category': 'Tutors',
            'description': 'Professional training in classical music, guitar, keyboard, drums, painting, and dance. All age groups welcome',
            'area': 3,  # Banjara Hills
            'address': 'Road No. 2, Banjara Hills',
            'phone': '+91 40 2354 1234',
            'email': 'info@musicartsacademy.in',
            'website': 'https://musicartsacademy.in',
            'image_url': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500',
            'rating': 4.8
        },
    ]
    
    added_count = 0
    for biz_data in businesses_data:
        # Get category and area
        category = categories.get(biz_data['category'])
        area = areas[biz_data['area']]
        
        if not category:
            print(f"❌ Category not found: {biz_data['category']}")
            continue
        
        # Check if business already exists
        existing = Business.query.filter_by(name=biz_data['name'], area_id=area.id).first()
        if not existing:
            business = Business(
                name=biz_data['name'],
                description=biz_data['description'],
                address=biz_data['address'],
                phone=biz_data['phone'],
                email=biz_data['email'],
                website=biz_data.get('website'),
                image_url=biz_data.get('image_url'),
                rating=biz_data.get('rating', 4.0),
                category_id=category.id,
                area_id=area.id,
                owner_id=owner.id,
                is_active=True
            )
            db.session.add(business)
            added_count += 1
            print(f"✓ Added: {biz_data['name']} ({biz_data['category']}) in {area.name}")
        else:
            print(f"✗ Already exists: {biz_data['name']}")
    
    # Commit all businesses
    if added_count > 0:
        db.session.commit()
        print(f"\n✅ Successfully added {added_count} businesses!")
    else:
        print("\n⚠️ No new businesses added (all already exist)")
    
    # Display summary
    print("\n" + "="*60)
    print("📊 DATABASE SUMMARY")
    print("="*60)
    
    total_areas = Area.query.count()
    total_categories = Category.query.count()
    total_businesses = Business.query.count()
    
    print(f"Total Areas: {total_areas}")
    print(f"Total Categories: {total_categories}")
    print(f"Total Businesses: {total_businesses}")
    
    print("\nBusinesses by Category:")
    for cat_name, cat_obj in categories.items():
        if cat_obj:
            count = Business.query.filter_by(category_id=cat_obj.id).count()
            print(f"  • {cat_obj.icon} {cat_name}: {count} businesses")
    
    print("\nBusinesses by Area:")
    for area in areas:
        count = Business.query.filter_by(area_id=area.id).count()
        print(f"  • {area.name}, {area.city}: {count} businesses")
