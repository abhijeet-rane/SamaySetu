# 👑 Create Admin User Guide

## 🎯 Overview

Admin users have full system access and can manage all resources. Since registration creates TEACHER role by default, you need to create the first admin manually.

---

## 🚀 Method 1: Using Postman + Database (Recommended)

### Step 1: Generate Password Hash (30 seconds)

**Postman Request:**
```
POST http://localhost:8083/auth/
Content-Type: application/json

{
  "password": "admin123"
}
```

**Response Example:**
```
$2a$10$N9qo8uLOickgx2ZMRZoMyeIH9QZXqb5UzVYhYXqLqLqLqLqLqLqLq
```

**Copy this hash!**

---

### Step 2: Insert Admin into Database (1 minute)

**Open MySQL:**
```bash
mysql -u root -proot samaysetu
```

**Insert Admin User:**
```sql
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
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIH9QZXqb5UzVYhYXqLqLqLqLqLqLqLq',
    'ADMIN',
    NOW(),
    NOW()
);
```

**Verify:**
```sql
SELECT id, name, email, role, is_email_verified, is_active 
FROM teachers 
WHERE role = 'ADMIN';
```

---

### Step 3: Login as Admin (30 seconds)

**Postman Request:**
```
POST http://localhost:8083/auth/login
Content-Type: application/json

{
  "email": "admin@mitaoe.ac.in",
  "password": "admin123"
}
```

**Success Response:**
```json
{
  "email": "admin@mitaoe.ac.in",
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "role": "ADMIN"
}
```

✅ **You're now logged in as Admin!**

---

## 🔧 Method 2: Direct SQL (Fastest)

### One-Step SQL Script

**Copy and run this complete script:**

```sql
USE samaysetu;

-- Insert admin with pre-hashed password (password: admin123)
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

-- Verify admin created
SELECT id, name, email, role, is_email_verified, is_active 
FROM teachers 
WHERE role = 'ADMIN';
```

**Login Credentials:**
- Email: `admin@mitaoe.ac.in`
- Password: `admin123`

---

## 📝 Method 3: SQL Script File

### Create SQL File

Save this as `create_admin.sql`:

```sql
-- Create Admin User for SamaySetu
-- Password: admin123

USE samaysetu;

-- Check if admin already exists
SELECT 'Checking for existing admin...' AS status;
SELECT COUNT(*) as admin_count FROM teachers WHERE role = 'ADMIN';

-- Insert admin user
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

-- Verify creation
SELECT 'Admin user created successfully!' AS status;
SELECT id, name, email, role, is_email_verified, is_active 
FROM teachers 
WHERE role = 'ADMIN';

-- Display login credentials
SELECT 
    'Login Credentials:' AS info,
    'Email: admin@mitaoe.ac.in' AS email,
    'Password: admin123' AS password;
```

**Run the script:**
```bash
mysql -u root -proot samaysetu < create_admin.sql
```

---

## 🎨 Method 4: Multiple Admins

### Create Multiple Admin Users

```sql
USE samaysetu;

-- Main System Admin
INSERT INTO teachers (name, employee_id, email, phone, weekly_hours_limit, specialization, is_active, is_email_verified, password, role, created_at, updated_at)
VALUES ('System Administrator', 'ADMIN001', 'admin@mitaoe.ac.in', '9999999999', 40, 'System Administration', 1, 1, '$2a$10$eImiTXuWVxfM37uY4JANjQ8.qzZJEqLqLqLqLqLqLqLqLqLqLqLqLq', 'ADMIN', NOW(), NOW());

-- HOD Computer Science
INSERT INTO teachers (name, employee_id, email, phone, weekly_hours_limit, specialization, is_active, is_email_verified, password, role, created_at, updated_at)
VALUES ('Dr. John Smith', 'HOD001', 'hod.cs@mitaoe.ac.in', '9876543210', 40, 'Computer Science', 1, 1, '$2a$10$eImiTXuWVxfM37uY4JANjQ8.qzZJEqLqLqLqLqLqLqLqLqLqLqLqLq', 'ADMIN', NOW(), NOW());

-- Academic Coordinator
INSERT INTO teachers (name, employee_id, email, phone, weekly_hours_limit, specialization, is_active, is_email_verified, password, role, created_at, updated_at)
VALUES ('Prof. Jane Doe', 'COORD001', 'coordinator@mitaoe.ac.in', '9876543211', 40, 'Academic Coordination', 1, 1, '$2a$10$eImiTXuWVxfM37uY4JANjQ8.qzZJEqLqLqLqLqLqLqLqLqLqLqLqLq', 'ADMIN', NOW(), NOW());

-- Verify all admins
SELECT id, name, email, role FROM teachers WHERE role = 'ADMIN';
```

**All use password:** `admin123`

---

## 🔒 Method 5: Custom Password

### Generate Your Own Password Hash

**Step 1: Generate hash in Postman:**
```
POST http://localhost:8083/auth/
{
  "password": "YourSecurePassword123!"
}
```

**Step 2: Use the hash in SQL:**
```sql
INSERT INTO teachers (
    name, employee_id, email, phone, weekly_hours_limit, 
    specialization, is_active, is_email_verified, password, 
    role, created_at, updated_at
)
VALUES (
    'Your Name',
    'ADMIN001',
    'youremail@mitaoe.ac.in',
    '1234567890',
    40,
    'Your Specialization',
    1,
    1,
    'YOUR_GENERATED_HASH_HERE',
    'ADMIN',
    NOW(),
    NOW()
);
```

---

## ✅ Verification Checklist

After creating admin, verify:

### 1. Check Database
```sql
SELECT 
    id, 
    name, 
    email, 
    role, 
    is_email_verified, 
    is_active,
    SUBSTRING(password, 1, 10) as password_preview
FROM teachers 
WHERE role = 'ADMIN';
```

**Expected:**
- `role` = `ADMIN`
- `is_email_verified` = `1`
- `is_active` = `1`
- `password` starts with `$2a$10$`

---

### 2. Test Login
```
POST http://localhost:8083/auth/login
{
  "email": "admin@mitaoe.ac.in",
  "password": "admin123"
}
```

**Expected Response:**
```json
{
  "email": "admin@mitaoe.ac.in",
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "role": "ADMIN"
}
```

---

### 3. Test Admin Endpoint
```
GET http://localhost:8083/admin/api/departments
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected:** 200 OK (even if empty list)

---

## 🎯 Quick Reference

### Default Admin Credentials:
```
Email: admin@mitaoe.ac.in
Password: admin123
Role: ADMIN
```

### Pre-hashed Password (admin123):
```
$2a$10$eImiTXuWVxfM37uY4JANjQ8.qzZJEqLqLqLqLqLqLqLqLqLqLqLqLq
```

### SQL Quick Insert:
```sql
INSERT INTO teachers (name, employee_id, email, phone, weekly_hours_limit, specialization, is_active, is_email_verified, password, role, created_at, updated_at)
VALUES ('System Administrator', 'ADMIN001', 'admin@mitaoe.ac.in', '9999999999', 40, 'System Administration', 1, 1, '$2a$10$eImiTXuWVxfM37uY4JANjQ8.qzZJEqLqLqLqLqLqLqLqLqLqLqLqLq', 'ADMIN', NOW(), NOW());
```

---

## 🐛 Troubleshooting

### Issue: "Email not verified"

**Problem:** Admin can't login

**Solution:**
```sql
UPDATE teachers 
SET is_email_verified = 1, is_active = 1 
WHERE email = 'admin@mitaoe.ac.in';
```

---

### Issue: "Invalid credentials"

**Problem:** Password doesn't work

**Solutions:**
1. Regenerate hash using `/auth/` endpoint
2. Verify hash copied correctly (no extra spaces)
3. Check password in SQL matches what you're using

---

### Issue: "403 Forbidden on admin endpoints"

**Problem:** Can't access admin endpoints

**Solutions:**
1. Verify role is 'ADMIN' (not 'admin')
```sql
UPDATE teachers 
SET role = 'ADMIN' 
WHERE email = 'admin@mitaoe.ac.in';
```

2. Login again to get new token with correct role

---

### Issue: Duplicate Entry Error

**Problem:** Admin already exists

**Solution:**
```sql
-- Check existing admin
SELECT * FROM teachers WHERE email = 'admin@mitaoe.ac.in';

-- Delete if needed
DELETE FROM teachers WHERE email = 'admin@mitaoe.ac.in';

-- Then insert again
```

---

## 🔐 Security Best Practices

### 1. Change Default Password
After first login, change the password:
```
POST /auth/forgot-password
{
  "email": "admin@mitaoe.ac.in"
}
```

### 2. Use Strong Password
```
Minimum 8 characters
Include: uppercase, lowercase, numbers, symbols
Example: Admin@2024!Secure
```

### 3. Limit Admin Accounts
- Create only necessary admin accounts
- Use TEACHER role for regular users
- Review admin list regularly

### 4. Monitor Admin Activity
```sql
-- Check all admins
SELECT id, name, email, created_at 
FROM teachers 
WHERE role = 'ADMIN'
ORDER BY created_at DESC;
```

---

## 📊 Admin vs Teacher Comparison

| Feature | ADMIN | TEACHER |
|---------|-------|---------|
| Access | Full system | Limited |
| Endpoints | `/admin/**` + `/api/**` | `/api/teachers` |
| Can create | All resources | Teachers only |
| Can view | Everything | Own data |
| Can delete | Yes | No |
| Can modify | Everything | Own profile |

---

## 🎨 Customization

### Custom Admin Fields

```sql
INSERT INTO teachers (
    name,                    -- Your name
    employee_id,             -- Your employee ID
    email,                   -- Your college email
    phone,                   -- Your phone
    weekly_hours_limit,      -- 40 for admin
    specialization,          -- Your department/role
    is_active,               -- 1 (active)
    is_email_verified,       -- 1 (verified)
    password,                -- BCrypt hash
    role,                    -- 'ADMIN'
    created_at,              -- NOW()
    updated_at               -- NOW()
)
VALUES (
    'Your Name Here',
    'YOUR_EMP_ID',
    'your.email@mitaoe.ac.in',
    'YOUR_PHONE',
    40,
    'Your Department',
    1,
    1,
    'YOUR_PASSWORD_HASH',
    'ADMIN',
    NOW(),
    NOW()
);
```

---

## 📝 Complete Setup Script

Save as `setup_admin.sql`:

```sql
-- ============================================
-- SamaySetu Admin User Setup Script
-- ============================================

USE samaysetu;

-- Display current status
SELECT '=== Current Admin Users ===' AS status;
SELECT id, name, email, role, is_active 
FROM teachers 
WHERE role = 'ADMIN';

-- Create main admin
SELECT '=== Creating System Administrator ===' AS status;
INSERT INTO teachers (
    name, employee_id, email, phone, weekly_hours_limit, 
    specialization, is_active, is_email_verified, password, 
    role, created_at, updated_at
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

-- Verify creation
SELECT '=== Admin Created Successfully ===' AS status;
SELECT id, name, email, role, is_email_verified, is_active 
FROM teachers 
WHERE email = 'admin@mitaoe.ac.in';

-- Display credentials
SELECT '=== Login Credentials ===' AS info;
SELECT 
    'Email: admin@mitaoe.ac.in' AS credential,
    'Password: admin123' AS password,
    'Role: ADMIN' AS role;

SELECT '=== Setup Complete! ===' AS status;
```

**Run:**
```bash
mysql -u root -proot samaysetu < setup_admin.sql
```

---

## ✅ Summary

### Quickest Method:
1. Run SQL insert with pre-hashed password
2. Login with `admin@mitaoe.ac.in` / `admin123`
3. Done!

### Most Secure Method:
1. Generate custom password hash
2. Use your own email and credentials
3. Change password after first login

### For Production:
1. Use strong, unique password
2. Use real admin email
3. Document admin accounts
4. Regular security audits

---

## 🎉 You're Done!

Admin user created! You can now:
- ✅ Login as admin
- ✅ Access all admin endpoints
- ✅ Create departments, courses, rooms
- ✅ Manage all system resources

**Next Steps:**
1. Login as admin
2. Create departments
3. Create academic years
4. Set up courses and rooms

Happy Administrating! 👑
