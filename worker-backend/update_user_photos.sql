-- Update existing users with profile photos

-- Super Admin
UPDATE users SET profile_photo = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop' WHERE email = 'superadmin@businessdiary.com';

-- Admin
UPDATE users SET profile_photo = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop' WHERE email = 'admin@businessdiary.com';
UPDATE users SET profile_photo = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop' WHERE email = 'admin2@businessdiary.com';

-- Business Owners
UPDATE users SET profile_photo = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' WHERE email = 'owner1@businessdiary.com';
UPDATE users SET profile_photo = 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop' WHERE email = 'owner2@businessdiary.com';
UPDATE users SET profile_photo = 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop' WHERE email = 'owner3@businessdiary.com';

-- Employees
UPDATE users SET profile_photo = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop' WHERE email = 'employee1@businessdiary.com';
UPDATE users SET profile_photo = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop' WHERE email = 'employee2@businessdiary.com';

-- Sales Team
UPDATE users SET profile_photo = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop' WHERE email = 'sales1@businessdiary.com';
UPDATE users SET profile_photo = 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop' WHERE email = 'sales2@businessdiary.com';
UPDATE users SET profile_photo = 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop' WHERE email = 'sales3@businessdiary.com';
