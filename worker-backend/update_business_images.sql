-- Update existing businesses with image URLs
UPDATE businesses SET image_url = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop' WHERE name = 'The Grand Restaurant';
UPDATE businesses SET image_url = 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=600&fit=crop' WHERE name = 'Quick Bites';
UPDATE businesses SET image_url = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop' WHERE name = 'Apollo Clinic';
UPDATE businesses SET image_url = 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&h=600&fit=crop' WHERE name = 'City Hospital';
UPDATE businesses SET image_url = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop' WHERE name = 'Excel Coaching';

-- Insert additional businesses with images
INSERT OR IGNORE INTO businesses (name, description, address, phone, email, image_url, category_id, subcategory_id, area_id, rating, total_ratings) VALUES
('Cafe Delight', 'Cozy coffee shop with pastries', '789 Park St, Bandra', '9876543215', 'cafedelight@example.com', 'https://images.unsplash.com/photo-1559305616-3b04e63a5685?w=800&h=600&fit=crop', 1, 3, 2, 4.3, 67),
('MediPlus Pharmacy', '24/7 medicine store', '12 Health Road, Koramangala', '9876543216', 'mediplus@example.com', 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&h=600&fit=crop', 2, 6, 3, 4.4, 89),
('Bright Future School', 'CBSE affiliated school', '45 Education St, Connaught Place', '9876543217', 'brightfuture@example.com', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop', 3, 7, 5, 4.6, 134),
('TechMart Electronics', 'Latest gadgets and electronics', '67 Shopping Mall, Andheri', '9876543218', 'techmart@example.com', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop', 4, NULL, 1, 4.2, 156),
('Fresh Bazaar', 'Organic fruits and vegetables', '34 Market Street, Indiranagar', '9876543219', 'freshbazaar@example.com', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=600&fit=crop', 4, NULL, 4, 4.5, 201);
