from app import create_app
from models import db, Business

app = create_app()

with app.app_context():
    businesses = Business.query.all()
    for b in businesses[:5]:
        print(f"Business {b.id}: {b.name}")
        print(f"  subcategory_id: {b.subcategory_id}")
        print(f"  subcategory: {b.subcategory}")
        try:
            result = b.to_dict()
            print(f"  to_dict() works: ✅")
        except Exception as e:
            print(f"  to_dict() error: ❌ {e}")
        print()
