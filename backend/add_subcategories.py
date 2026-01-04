"""
Add subcategories to existing categories
"""
from app import create_app
from models import db, Category, SubCategory

def add_subcategories():
    app = create_app()
    
    with app.app_context():
        # Define subcategories for each category
        subcategories_data = {
            'Doctors': [
                {'name': 'General Physician', 'icon': '🩺', 'description': 'General health checkups and consultations'},
                {'name': 'Cardiologist', 'icon': '❤️', 'description': 'Heart and cardiovascular specialists'},
                {'name': 'Dermatologist', 'icon': '🧴', 'description': 'Skin, hair, and nail specialists'},
                {'name': 'Orthopedic', 'icon': '🦴', 'description': 'Bone and joint specialists'},
                {'name': 'Dentist', 'icon': '🦷', 'description': 'Dental care and oral health'},
                {'name': 'Pediatrician', 'icon': '👶', 'description': 'Child healthcare specialists'},
                {'name': 'Gynecologist', 'icon': '👩‍⚕️', 'description': 'Women\'s health specialists'},
                {'name': 'Ophthalmologist', 'icon': '👁️', 'description': 'Eye care specialists'},
                {'name': 'ENT Specialist', 'icon': '👂', 'description': 'Ear, nose, and throat specialists'},
                {'name': 'Neurologist', 'icon': '🧠', 'description': 'Brain and nervous system specialists'},
            ],
            'Fitness': [
                {'name': 'Gym', 'icon': '🏋️', 'description': 'Weight training and fitness centers'},
                {'name': 'Yoga Studio', 'icon': '🧘', 'description': 'Yoga and meditation classes'},
                {'name': 'Zumba Classes', 'icon': '💃', 'description': 'Dance fitness classes'},
                {'name': 'CrossFit', 'icon': '⚡', 'description': 'High-intensity functional training'},
                {'name': 'Pilates', 'icon': '🤸', 'description': 'Core strengthening exercises'},
                {'name': 'Boxing & MMA', 'icon': '🥊', 'description': 'Combat sports training'},
                {'name': 'Personal Training', 'icon': '👟', 'description': 'One-on-one fitness coaching'},
            ],
            'Restaurant': [
                {'name': 'Fine Dining', 'icon': '🍽️', 'description': 'Upscale dining experience'},
                {'name': 'Fast Food', 'icon': '🍔', 'description': 'Quick service restaurants'},
                {'name': 'Cafe', 'icon': '☕', 'description': 'Coffee shops and light meals'},
                {'name': 'Indian Cuisine', 'icon': '🍛', 'description': 'Traditional Indian food'},
                {'name': 'Chinese Cuisine', 'icon': '🥢', 'description': 'Chinese food restaurants'},
                {'name': 'Italian Cuisine', 'icon': '🍕', 'description': 'Pizza, pasta, and Italian dishes'},
                {'name': 'Bakery', 'icon': '🥐', 'description': 'Bread, cakes, and pastries'},
                {'name': 'Vegetarian', 'icon': '🥗', 'description': 'Pure vegetarian restaurants'},
                {'name': 'Seafood', 'icon': '🦞', 'description': 'Fish and seafood specialties'},
                {'name': 'BBQ & Grill', 'icon': '🍖', 'description': 'Grilled and barbecue dishes'},
            ],
            'Automobile': [
                {'name': 'Car Service Center', 'icon': '🚗', 'description': 'Car repair and maintenance'},
                {'name': 'Bike Service Center', 'icon': '🏍️', 'description': 'Motorcycle repair and service'},
                {'name': 'Spare Parts', 'icon': '🔧', 'description': 'Auto spare parts dealers'},
                {'name': 'Car Wash', 'icon': '💦', 'description': 'Vehicle cleaning services'},
                {'name': 'Tire Shop', 'icon': '⚙️', 'description': 'Tire sales and replacement'},
                {'name': 'Car Accessories', 'icon': '🎵', 'description': 'Vehicle accessories and upgrades'},
                {'name': 'Body Shop', 'icon': '🔨', 'description': 'Denting and painting services'},
            ],
            'Tutors': [
                {'name': 'Academic Tuition', 'icon': '📚', 'description': 'School subjects coaching'},
                {'name': 'Competitive Exams', 'icon': '📝', 'description': 'Entrance exam preparation'},
                {'name': 'Language Classes', 'icon': '🗣️', 'description': 'Foreign language learning'},
                {'name': 'Music Classes', 'icon': '🎵', 'description': 'Music instrument training'},
                {'name': 'Dance Classes', 'icon': '💃', 'description': 'Various dance forms'},
                {'name': 'Art & Craft', 'icon': '🎨', 'description': 'Drawing and painting classes'},
                {'name': 'Coding Classes', 'icon': '💻', 'description': 'Programming and technology'},
                {'name': 'Spoken English', 'icon': '🎤', 'description': 'English speaking courses'},
            ],
            'Photo Studio': [
                {'name': 'Wedding Photography', 'icon': '💒', 'description': 'Wedding photo and video services'},
                {'name': 'Portrait Studio', 'icon': '📸', 'description': 'Professional portrait photography'},
                {'name': 'Event Photography', 'icon': '🎉', 'description': 'Party and event coverage'},
                {'name': 'Product Photography', 'icon': '📦', 'description': 'Commercial product shoots'},
                {'name': 'Passport Photos', 'icon': '🆔', 'description': 'ID and passport photo services'},
                {'name': 'Video Production', 'icon': '🎬', 'description': 'Video shooting and editing'},
            ],
        }
        
        added_count = 0
        skipped_count = 0
        
        for category_name, subcats in subcategories_data.items():
            # Find the category
            category = Category.query.filter_by(name=category_name).first()
            
            if not category:
                print(f"⚠️  Category '{category_name}' not found. Skipping...")
                continue
            
            print(f"\n📂 Adding subcategories for {category_name}...")
            
            for subcat_data in subcats:
                # Check if subcategory already exists
                existing = SubCategory.query.filter_by(
                    name=subcat_data['name'],
                    category_id=category.id
                ).first()
                
                if existing:
                    print(f"  ✗ Already exists: {subcat_data['name']}")
                    skipped_count += 1
                else:
                    subcategory = SubCategory(
                        name=subcat_data['name'],
                        category_id=category.id,
                        icon=subcat_data.get('icon', ''),
                        description=subcat_data.get('description', ''),
                        is_active=True
                    )
                    db.session.add(subcategory)
                    print(f"  ✓ Added: {subcat_data['name']}")
                    added_count += 1
        
        db.session.commit()
        
        print("\n" + "="*60)
        print("📊 SUBCATEGORY ADDITION SUMMARY")
        print("="*60)
        print(f"✅ New subcategories added: {added_count}")
        print(f"⏭️  Already existing: {skipped_count}")
        print(f"📈 Total processed: {added_count + skipped_count}")
        
        # Show summary by category
        print("\n📋 Subcategories by Category:")
        for category_name in subcategories_data.keys():
            category = Category.query.filter_by(name=category_name).first()
            if category:
                count = SubCategory.query.filter_by(category_id=category.id, is_active=True).count()
                print(f"  • {category_name}: {count} subcategories")

if __name__ == '__main__':
    add_subcategories()
