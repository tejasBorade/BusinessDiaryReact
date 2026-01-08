-- Insert sample users for each role
-- All passwords are: Password@123

-- Super Admin
INSERT INTO users (email, password, full_name, phone, role, is_active) VALUES
('superadmin@businessdiary.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'John Doe', '9876543210', 'super_admin', 1);

-- Admin
INSERT INTO users (email, password, full_name, phone, role, is_active) VALUES
('admin@businessdiary.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Sarah Wilson', '9876543211', 'admin', 1),
('admin2@businessdiary.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Mike Johnson', '9876543212', 'admin', 1);

-- Business Owners
INSERT INTO users (email, password, full_name, phone, role, is_active) VALUES
('owner1@businessdiary.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Rajesh Kumar', '9876543220', 'business_owner', 1),
('owner2@businessdiary.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Priya Sharma', '9876543221', 'business_owner', 1),
('owner3@businessdiary.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Amit Patel', '9876543222', 'business_owner', 1);

-- Employees
INSERT INTO users (email, password, full_name, phone, role, is_active) VALUES
('employee1@businessdiary.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Rahul Singh', '9876543230', 'employee', 1),
('employee2@businessdiary.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Sneha Reddy', '9876543231', 'employee', 1);

-- Sales Team
INSERT INTO users (email, password, full_name, phone, role, is_active) VALUES
('sales1@businessdiary.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Vikram Mehta', '9876543240', 'sales', 1),
('sales2@businessdiary.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Anjali Gupta', '9876543241', 'sales', 1),
('sales3@businessdiary.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Karan Verma', '9876543242', 'sales', 1);
