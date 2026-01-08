-- Add roles table
CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    permissions TEXT, -- JSON string of permissions
    created_at TEXT DEFAULT (datetime('now'))
);

-- Insert roles
INSERT INTO roles (name, description, permissions) VALUES
('super_admin', 'Super Administrator - Full system access', '["all"]'),
('admin', 'Administrator - Manage users and businesses', '["manage_users", "manage_businesses", "manage_categories", "manage_areas"]'),
('business_owner', 'Business Owner - Manage own business', '["manage_own_business", "view_bookings", "respond_to_reviews"]'),
('employee', 'Employee - Limited access', '["view_businesses", "create_bookings"]'),
('sales', 'Sales Team - Lead generation and follow-ups', '["view_businesses", "add_leads", "follow_up", "view_reports"]');

-- Update users table to add role_id foreign key
-- Note: SQLite doesn't support ALTER TABLE ADD CONSTRAINT, so we'll use role text field
-- But let's add a leads table for sales team

CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_id INTEGER,
    user_id INTEGER, -- sales person
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT,
    status TEXT DEFAULT 'new', -- new, contacted, interested, converted, closed
    notes TEXT,
    follow_up_date TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (business_id) REFERENCES businesses(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_leads_user ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
