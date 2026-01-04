# Subcategories Feature Documentation

## Overview
Subcategories have been successfully added to allow fine-grained classification of businesses. For example, the "Doctors" category now has subcategories like "Cardiologist", "Dermatologist", "Orthopedic", etc.

## Backend Implementation

### Database Schema

**SubCategory Model** (`backend/models.py`):
- `id` - Primary key
- `name` - Subcategory name (e.g., "Cardiologist")
- `category_id` - Foreign key to Category
- `description` - Optional description
- `icon` - Optional emoji icon
- `is_active` - Boolean flag
- `created_at` - Timestamp

**Business Model** - Updated with:
- `subcategory_id` - Foreign key to SubCategory (nullable)
- Relationship: `subcategory` backref

### API Endpoints

#### Get All Subcategories
```http
GET /api/subcategories
GET /api/subcategories?category_id=3
```
Returns all active subcategories or filtered by category.

#### Get Specific Subcategory
```http
GET /api/subcategories/5
```

#### Get Category with Subcategories
```http
GET /api/categories?include_subcategories=true
GET /api/categories/3?include_subcategories=true
```

#### Get Subcategories for a Category
```http
GET /api/subcategories/category/3
```

#### Create Subcategory (Admin Only)
```http
POST /api/subcategories
Authorization: Bearer <token>

{
  "name": "Cardiologist",
  "category_id": 3,
  "description": "Heart specialists",
  "icon": "❤️"
}
```

#### Update Subcategory (Admin Only)
```http
PUT /api/subcategories/5
Authorization: Bearer <token>

{
  "name": "Updated Name",
  "description": "Updated description"
}
```

#### Delete Subcategory (Admin Only)
```http
DELETE /api/subcategories/5
Authorization: Bearer <token>
```

#### Filter Businesses by Subcategory
```http
GET /api/businesses?subcategory_id=5
GET /api/businesses?category_id=3&subcategory_id=5
```

### Populated Subcategories

**Doctors** (10 subcategories):
- 🩺 General Physician
- ❤️ Cardiologist
- 🧴 Dermatologist
- 🦴 Orthopedic
- 🦷 Dentist
- 👶 Pediatrician
- 👩‍⚕️ Gynecologist
- 👁️ Ophthalmologist
- 👂 ENT Specialist
- 🧠 Neurologist

**Fitness** (7 subcategories):
- 🏋️ Gym
- 🧘 Yoga Studio
- 💃 Zumba Classes
- ⚡ CrossFit
- 🤸 Pilates
- 🥊 Boxing & MMA
- 👟 Personal Training

**Restaurant** (10 subcategories):
- 🍽️ Fine Dining
- 🍔 Fast Food
- ☕ Cafe
- 🍛 Indian Cuisine
- 🥢 Chinese Cuisine
- 🍕 Italian Cuisine
- 🥐 Bakery
- 🥗 Vegetarian
- 🦞 Seafood
- 🍖 BBQ & Grill

**Automobile** (7 subcategories):
- 🚗 Car Service Center
- 🏍️ Bike Service Center
- 🔧 Spare Parts
- 💦 Car Wash
- ⚙️ Tire Shop
- 🎵 Car Accessories
- 🔨 Body Shop

**Tutors** (8 subcategories):
- 📚 Academic Tuition
- 📝 Competitive Exams
- 🗣️ Language Classes
- 🎵 Music Classes
- 💃 Dance Classes
- 🎨 Art & Craft
- 💻 Coding Classes
- 🎤 Spoken English

**Photo Studio** (6 subcategories):
- 💒 Wedding Photography
- 📸 Portrait Studio
- 🎉 Event Photography
- 📦 Product Photography
- 🆔 Passport Photos
- 🎬 Video Production

## Frontend Integration (To be implemented)

### 1. Home Page
- Show subcategories when clicking on a category card
- Filter businesses by subcategory
- Display subcategory badge on business cards

### 2. Business Detail Page
- Display subcategory name with icon
- Show category > subcategory breadcrumb

### 3. Business List/Search
- Add subcategory filter dropdown
- Filter by category first, then show relevant subcategories

### 4. My Businesses (Add/Edit)
- Add subcategory selector in business form
- Dropdown populated based on selected category
- Optional field (can be left empty)

### 5. Admin Panel
- New page: "Subcategories Management"
- CRUD operations for subcategories
- Assign subcategories to categories
- View business count per subcategory

## Testing

### Test Subcategories API:
```bash
# Get all subcategories
curl http://127.0.0.1:5000/api/subcategories

# Get Doctors subcategories
curl http://127.0.0.1:5000/api/subcategories?category_id=3

# Get categories with subcategories
curl http://127.0.0.1:5000/api/categories?include_subcategories=true

# Filter businesses by subcategory (Cardiologist)
curl http://127.0.0.1:5000/api/businesses?subcategory_id=11
```

### Add Subcategory via Postman:
1. Login to get token
2. POST to `/api/subcategories`
3. Include token in Authorization header
4. Send JSON body with name, category_id, description, icon

## Database Migration

To add subcategories table to existing database:
```bash
cd backend
python -c "from app import create_app; from models import db; app = create_app(); app.app_context().push(); db.create_all()"
python add_subcategories.py
```

## Next Steps

1. ✅ Backend models and API endpoints
2. ✅ Database schema and relationships
3. ✅ Populated with 48 subcategories across 6 categories
4. ⏳ Frontend UI for displaying subcategories
5. ⏳ Frontend filters and search by subcategory
6. ⏳ Business form with subcategory selector
7. ⏳ Admin subcategory management page

## Notes

- Subcategory is optional for businesses
- Multiple subcategories under same name allowed if in different categories
- Soft delete using `is_active` flag
- Icons are emoji characters for better visual representation
- All operations are role-protected (admin/super_admin only)

## Example Business Object with Subcategory

```json
{
  "id": 1,
  "name": "Dr. Sharma Clinic",
  "category": {
    "id": 3,
    "name": "Doctors",
    "icon": "👨‍⚕️"
  },
  "subcategory": {
    "id": 11,
    "name": "Cardiologist",
    "icon": "❤️",
    "category_id": 3
  },
  "area": {...},
  ...
}
```

## Error Handling

- 400: Missing required fields (name, category_id)
- 404: Category/Subcategory not found
- 403: Unauthorized (not admin)
- 500: Server error

All endpoints properly handle errors and return appropriate status codes with error messages.
