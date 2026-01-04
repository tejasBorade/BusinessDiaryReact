"""
Assign existing businesses to appropriate subcategories
"""
from app import create_app
from models import db, Business, Category, SubCategory

def assign_businesses():
    app = create_app()
    
    with app.app_context():
        # Get all businesses
        businesses = Business.query.all()
        
        print(f"📊 Found {len(businesses)} businesses to process\n")
        
        # Define mapping for business to subcategory assignment
        # Based on business name patterns and category
        assignments = {
            'Pixel Town Photo Studio': 'Wedding Photography',
        }
        
        # Get all subcategories
        subcategories_map = {}
        for subcat in SubCategory.query.all():
            category = Category.query.get(subcat.category_id)
            key = f"{category.name}:{subcat.name}"
            subcategories_map[key] = subcat.id
        
        updated_count = 0
        
        for business in businesses:
            # Get category name
            category = Category.query.get(business.category_id) if business.category_id else None
            
            if not category:
                print(f"⚠️  {business.name} - No category assigned")
                continue
            
            # Check if business already has a subcategory
            if business.subcategory_id:
                subcat = SubCategory.query.get(business.subcategory_id)
                print(f"✓ {business.name} - Already assigned to '{subcat.name}'")
                continue
            
            # Try to assign based on predefined mapping
            if business.name in assignments:
                subcat_name = assignments[business.name]
                key = f"{category.name}:{subcat_name}"
                
                if key in subcategories_map:
                    business.subcategory_id = subcategories_map[key]
                    updated_count += 1
                    print(f"✅ {business.name} → {subcat_name}")
                else:
                    print(f"❌ {business.name} - Subcategory '{subcat_name}' not found")
            else:
                # Auto-assign to first available subcategory in category
                first_subcat = SubCategory.query.filter_by(
                    category_id=business.category_id,
                    is_active=True
                ).first()
                
                if first_subcat:
                    business.subcategory_id = first_subcat.id
                    updated_count += 1
                    print(f"✅ {business.name} → {first_subcat.name} (auto-assigned)")
                else:
                    print(f"⚠️  {business.name} - No subcategories available in {category.name}")
        
        # Commit changes
        if updated_count > 0:
            db.session.commit()
            print(f"\n✅ Successfully updated {updated_count} businesses!")
        else:
            print(f"\n⚠️  No businesses were updated")
        
        # Print summary
        print("\n" + "="*60)
        print("📋 SUMMARY")
        print("="*60)
        
        # Show all businesses with their subcategories
        for business in Business.query.all():
            category = Category.query.get(business.category_id) if business.category_id else None
            subcat = SubCategory.query.get(business.subcategory_id) if business.subcategory_id else None
            
            cat_name = category.name if category else "No Category"
            subcat_name = subcat.name if subcat else "No Subcategory"
            
            print(f"  • {business.name}")
            print(f"    └─ {cat_name} → {subcat_name}")

if __name__ == '__main__':
    assign_businesses()
