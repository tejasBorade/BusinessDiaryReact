-- Insert sample users for each role
-- All passwords are: Password@123

-- Super Admin
INSERT INTO users (email, password, full_name, phone, profile_photo, role, is_active) VALUES
('superadmin@businessdiary.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'John Doe', '9876543210', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop', 'super_admin', 1);

-- Admin
INSERT INTO users (email, password, full_name, phone, profile_photo, role, is_active) VALUES
('admin@businessdiary.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Sarah Wilson', '9876543211', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop', 'admin', 1),
('admin2@businessdiary.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Mike Johnson', '9876543212', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', 'admin', 1);

-- Business Owners
INSERT INTO users (email, password, full_name, phone, profile_photo, role, is_active) VALUES
('owner1@businessdiary.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Rajesh Kumar', '9876543220', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', 'business_owner', 1),
('owner2@businessdiary.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Priya Sharma', '9876543221', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop', 'business_owner', 1),
('owner3@businessdiary.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Amit Patel', '9876543222', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop', 'business_owner', 1);

-- Employees
INSERT INTO users (email, password, full_name, phone, profile_photo, role, is_active) VALUES
('employee1@businessdiary.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Rahul Singh', '9876543230', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', 'employee', 1),
('employee2@businessdiary.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Sneha Reddy', '9876543231', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop', 'employee', 1);

-- Sales Team
INSERT INTO users (email, password, full_name, phone, profile_photo, role, is_active) VALUES
('sales1@businessdiary.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Vikram Mehta', '9876543240', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop', 'sales', 1),
('sales2@businessdiary.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Anjali Gupta', '9876543241', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop', 'sales', 1),
('sales3@businessdiary.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Karan Verma', '9876543242', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop', 'sales', 1);
