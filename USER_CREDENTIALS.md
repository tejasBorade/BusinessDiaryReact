# User Credentials and Database Queries

## Login Credentials

All users have the password: **Password@123**

### 1. Super Admin
- **Email:** superadmin@businessdiary.com
- **Password:** Password@123
- **Access:** Full system control, manage everything

### 2. Admin (2 users)
- **Email:** admin@businessdiary.com
- **Password:** Password@123
- **Name:** Sarah Wilson

- **Email:** admin2@businessdiary.com
- **Password:** Password@123
- **Name:** Mike Johnson
- **Access:** Manage users, businesses, categories, areas

### 3. Business Owners (3 users)
- **Email:** owner1@businessdiary.com
- **Password:** Password@123
- **Name:** Rajesh Kumar

- **Email:** owner2@businessdiary.com
- **Password:** Password@123
- **Name:** Priya Sharma

- **Email:** owner3@businessdiary.com
- **Password:** Password@123
- **Name:** Amit Patel
- **Access:** Manage own business, bookings, reviews

### 4. Employees (2 users)
- **Email:** employee1@businessdiary.com
- **Password:** Password@123
- **Name:** Rahul Singh

- **Email:** employee2@businessdiary.com
- **Password:** Password@123
- **Name:** Sneha Reddy
- **Access:** View businesses, create bookings

### 5. Sales Team (3 users)
- **Email:** sales1@businessdiary.com
- **Password:** Password@123
- **Name:** Vikram Mehta

- **Email:** sales2@businessdiary.com
- **Password:** Password@123
- **Name:** Anjali Gupta

- **Email:** sales3@businessdiary.com
- **Password:** Password@123
- **Name:** Karan Verma
- **Access:** View businesses, add leads, follow-ups

---

## Database Queries

### View All Tables
```sql
wrangler d1 execute businessdiarydb --remote --command "SELECT name FROM sqlite_master WHERE type='table'"
```

### Get All Users
```sql
wrangler d1 execute businessdiarydb --remote --command "SELECT id, email, full_name, phone, role, is_active FROM users"
```

### Get Users by Role
```sql
-- Super Admins
wrangler d1 execute businessdiarydb --remote --command "SELECT * FROM users WHERE role='super_admin'"

-- Admins
wrangler d1 execute businessdiarydb --remote --command "SELECT * FROM users WHERE role='admin'"

-- Business Owners
wrangler d1 execute businessdiarydb --remote --command "SELECT * FROM users WHERE role='business_owner'"

-- Employees
wrangler d1 execute businessdiarydb --remote --command "SELECT * FROM users WHERE role='employee'"

-- Sales Team
wrangler d1 execute businessdiarydb --remote --command "SELECT * FROM users WHERE role='sales'"
```

### Get All Roles
```sql
wrangler d1 execute businessdiarydb --remote --command "SELECT * FROM roles"
```

### Get All Categories
```sql
wrangler d1 execute businessdiarydb --remote --command "SELECT * FROM categories"
```

### Get All Subcategories
```sql
wrangler d1 execute businessdiarydb --remote --command "SELECT s.*, c.name as category_name FROM subcategories s JOIN categories c ON s.category_id = c.id"
```

### Get All Areas
```sql
wrangler d1 execute businessdiarydb --remote --command "SELECT * FROM areas ORDER BY state, city, name"
```

### Get All Businesses
```sql
wrangler d1 execute businessdiarydb --remote --command "SELECT b.*, c.name as category_name, s.name as subcategory_name, a.name as area_name FROM businesses b LEFT JOIN categories c ON b.category_id = c.id LEFT JOIN subcategories s ON b.subcategory_id = s.id LEFT JOIN areas a ON b.area_id = a.id"
```

### Get All Bookings
```sql
wrangler d1 execute businessdiarydb --remote --command "SELECT b.*, u.full_name as user_name, bus.name as business_name FROM bookings b JOIN users u ON b.user_id = u.id JOIN businesses bus ON b.business_id = bus.id"
```

### Get All Leads (for Sales)
```sql
wrangler d1 execute businessdiarydb --remote --command "SELECT l.*, u.full_name as sales_person, b.name as business_name FROM leads l JOIN users u ON l.user_id = u.id LEFT JOIN businesses b ON l.business_id = b.id"
```

### Count Statistics
```sql
-- Total users by role
wrangler d1 execute businessdiarydb --remote --command "SELECT role, COUNT(*) as count FROM users GROUP BY role"

-- Total businesses by category
wrangler d1 execute businessdiarydb --remote --command "SELECT c.name, COUNT(b.id) as count FROM categories c LEFT JOIN businesses b ON c.id = b.category_id GROUP BY c.id"

-- Total bookings by status
wrangler d1 execute businessdiarydb --remote --command "SELECT status, COUNT(*) as count FROM bookings GROUP BY status"
```

### Insert New User (Example)
```sql
wrangler d1 execute businessdiarydb --remote --command "INSERT INTO users (email, password, full_name, phone, role) VALUES ('newuser@example.com', 'hashed_password_here', 'New User Name', '9999999999', 'employee')"
```

### Update User Status
```sql
-- Deactivate user
wrangler d1 execute businessdiarydb --remote --command "UPDATE users SET is_active = 0 WHERE email = 'user@example.com'"

-- Activate user
wrangler d1 execute businessdiarydb --remote --command "UPDATE users SET is_active = 1 WHERE email = 'user@example.com'"
```

### Delete Data (Be Careful!)
```sql
-- Delete specific user
wrangler d1 execute businessdiarydb --remote --command "DELETE FROM users WHERE email = 'user@example.com'"

-- Delete all bookings for a business
wrangler d1 execute businessdiarydb --remote --command "DELETE FROM bookings WHERE business_id = 1"
```

### Backup Database
```bash
wrangler d1 export businessdiarydb --remote --output=backup-$(date +%Y%m%d).sql
```

---

## Quick Setup Commands

Run these in order:

```bash
# 1. Add roles table
wrangler d1 execute businessdiarydb --remote --file=add_roles.sql

# 2. Add sample users
wrangler d1 execute businessdiarydb --remote --file=seed_users.sql

# 3. Verify users created
wrangler d1 execute businessdiarydb --remote --command "SELECT email, full_name, role FROM users"
```

---

## API Endpoints to Test

### Login
```bash
curl -X POST https://businessdiary-api.tejasborade9594.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@businessdiary.com","password":"Password@123"}'
```

### Get Categories (No auth required)
```bash
curl https://businessdiary-api.tejasborade9594.workers.dev/api/categories
```

### Get Businesses (No auth required)
```bash
curl https://businessdiary-api.tejasborade9594.workers.dev/api/businesses
```

---

## Database Schema Overview

**Tables:**
1. `users` - All system users with roles
2. `roles` - Role definitions and permissions
3. `categories` - Business categories
4. `subcategories` - Sub-categories under categories
5. `areas` - Geographical areas (city/state)
6. `businesses` - Business listings
7. `bookings` - Customer bookings
8. `leads` - Sales leads and follow-ups

**Relationships:**
- users → businesses (owner_id)
- categories → subcategories (category_id)
- businesses → categories, subcategories, areas
- bookings → businesses, users
- leads → businesses, users (sales person)
