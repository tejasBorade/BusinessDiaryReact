-- Insert sample categories
INSERT INTO categories (name, description, icon) VALUES
('Restaurants', 'Food and dining establishments', '🍽️'),
('Healthcare', 'Medical and health services', '🏥'),
('Education', 'Schools and training centers', '📚'),
('Shopping', 'Retail stores and markets', '🛒'),
('Automotive', 'Car services and dealerships', '🚗'),
('Beauty & Spa', 'Salons and wellness centers', '💅'),
('Home Services', 'Plumbing, electrical, cleaning', '🏠'),
('Entertainment', 'Movies, gaming, recreation', '🎮'),
('Fitness', 'Gyms and sports facilities', '💪'),
('Hotels', 'Accommodation and lodging', '🏨');

-- Insert sample subcategories
INSERT INTO subcategories (name, description, category_id) VALUES
('Fast Food', 'Quick service restaurants', 1),
('Fine Dining', 'Upscale restaurants', 1),
('Cafes', 'Coffee shops and cafes', 1),
('Hospitals', 'Multi-specialty hospitals', 2),
('Clinics', 'Medical clinics', 2),
('Pharmacy', 'Medicine stores', 2),
('Schools', 'Primary and secondary schools', 3),
('Colleges', 'Higher education', 3),
('Coaching Centers', 'Tutorial and training', 3);

-- Insert sample areas
INSERT INTO areas (name, city, state, pincode) VALUES
('Andheri', 'Mumbai', 'Maharashtra', '400058'),
('Bandra', 'Mumbai', 'Maharashtra', '400050'),
('Koramangala', 'Bangalore', 'Karnataka', '560034'),
('Indiranagar', 'Bangalore', 'Karnataka', '560038'),
('Connaught Place', 'Delhi', 'Delhi', '110001'),
('Saket', 'Delhi', 'Delhi', '110017'),
('Park Street', 'Kolkata', 'West Bengal', '700016'),
('Salt Lake', 'Kolkata', 'West Bengal', '700064'),
('Anna Nagar', 'Chennai', 'Tamil Nadu', '600040'),
('T Nagar', 'Chennai', 'Tamil Nadu', '600017');

-- Insert sample super admin user (password: admin123)
INSERT INTO users (email, password, full_name, phone, role) VALUES
('admin@businessdiary.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Super Admin', '9999999999', 'super_admin');

-- Insert sample businesses
INSERT INTO businesses (name, description, address, phone, email, category_id, subcategory_id, area_id, rating, total_ratings) VALUES
('The Grand Restaurant', 'Fine dining with Indian and Continental cuisine', '123 Main St, Andheri', '9876543210', 'grandrestaurant@example.com', 1, 2, 1, 4.5, 120),
('Quick Bites', 'Fast food and snacks', '45 Station Rd, Bandra', '9876543211', 'quickbites@example.com', 1, 1, 2, 4.0, 85),
('Apollo Clinic', 'Multi-specialty medical clinic', '789 Health Ave, Koramangala', '9876543212', 'apollo@example.com', 2, 5, 3, 4.8, 200),
('City Hospital', '24/7 emergency and medical services', '321 Care St, Indiranagar', '9876543213', 'cityhospital@example.com', 2, 4, 4, 4.6, 150),
('Excel Coaching', 'Competitive exam preparation', '56 Study Lane, Connaught Place', '9876543214', 'excelcoach@example.com', 3, 9, 5, 4.7, 95);
