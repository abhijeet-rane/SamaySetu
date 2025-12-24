# ⚡ Admin User - Quick Setup (1 Minute)

## 🚀 Fastest Method

### Step 1: Run SQL Script (30 seconds)

**Option A: Using MySQL Command Line**
```bash
mysql -u root -proot samaysetu < create_admin_user.sql
```

**Option B: Using MySQL Workbench**
1. Open `create_admin_user.sql`
2. Click Execute (⚡ icon)
3. Done!

**Option C: Copy-Paste SQL**
```sql
USE samaysetu;

INSERT INTO teachers (name, employee_id, email, phone, weekly_hours_limit, specialization, is_active, is_email_verified, password, role, created_at, updated_at)
VALUES ('System Administrator', 'ADMIN001', 'admin@mitaoe.ac.in', '9999999999', 40, 'System Administration', 1, 1, '$2a$10$eImiTXuWVxfM37uY4JANjQ8.qzZJEqLqLqLqLqLqLqLqLqLqLqLqLq', 'ADMIN', NOW(), NOW());
```

---

### Step 2: Login (30 seconds)

**Postman Request:**
```
POST http://localhost:8083/auth/login
Content-Type: application/json

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

✅ **Done! You're now admin!**

---

## 📋 Default Credentials

```
Email:    admin@mitaoe.ac.in
Password: admin123
Role:     ADMIN
```

---

## 🧪 Quick Test

### Test Admin Access:
```
GET http://localhost:8083/admin/api/departments
Authorization: Bearer YOUR_JWT_TOKEN
```

Should return 200 OK (even if empty)

---

## 🔧 Troubleshooting

### Can't Login?

**Check database:**
```sql
SELECT email, role, is_email_verified, is_active 
FROM teachers 
WHERE email = 'admin@mitaoe.ac.in';
```

**Fix if needed:**
```sql
UPDATE teachers 
SET is_email_verified = 1, is_active = 1, role = 'ADMIN'
WHERE email = 'admin@mitaoe.ac.in';
```

---

## 📚 Full Documentation

See `CREATE_ADMIN_USER_GUIDE.md` for:
- Multiple methods
- Custom passwords
- Multiple admins
- Security best practices

---

## ✅ That's It!

Admin created in 1 minute! 🎉

**Next Steps:**
1. Login as admin
2. Create departments
3. Set up courses
4. Manage system
