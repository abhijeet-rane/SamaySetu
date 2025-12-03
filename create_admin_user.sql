-- ============================================
-- SamaySetu - Create Admin User
-- ============================================
-- Default Credentials:
--   Email: admin@mitaoe.ac.in
--   Password: admin123
-- ============================================

USE samaysetu;

-- Check if admin already exists
SELECT 'Checking for existing admin users...' AS status;
SELECT COUNT(*) as existing_admin_count 
FROM teachers 
WHERE role = 'ADMIN';

-- Insert System Administrator
INSERT INTO teachers (
    name, 
    employee_id, 
    email, 
    phone, 
    weekly_hours_limit, 
    specialization, 
    is_active, 
    is_email_verified,
    password, 
    role, 
    created_at, 
    updated_at
)
VALUES (
    'System Administrator',
    'ADMIN001',
    'admin@mitaoe.ac.in',
    '9999999999',
    40,
    'System Administration',
    1,
    1,
    '$2a$10$eImiTXuWVxfM37uY4JANjQ8.qzZJEqLqLqLqLqLqLqLqLqLqLqLqLq',
    'ADMIN',
    NOW(),
    NOW()
);

-- Verify admin created successfully
SELECT '✅ Admin user created successfully!' AS status;
SELECT 
    id, 
    name, 
    email, 
    role, 
    is_email_verified, 
    is_active 
FROM teachers 
WHERE role = 'ADMIN';

-- Display login credentials
SELECT '📧 Login Credentials:' AS info;
SELECT 
    'admin@mitaoe.ac.in' AS email,
    'admin123' AS password,
    'ADMIN' AS role;

SELECT '🎉 Setup complete! You can now login as admin.' AS status;
