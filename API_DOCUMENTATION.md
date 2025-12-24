# 📚 SamaySetu API Documentation

Complete API reference for SamaySetu Timetable Management System with examples and authentication details.

## 🔗 Base URL
```
Production: https://your-domain.com/api
Development: http://localhost:8083
```

## 🔐 Authentication

### JWT Token Authentication
All protected endpoints require a JWT token in the Authorization header:
```http
Authorization: Bearer <jwt_token>
```

### Token Lifecycle:
- **Expiration**: 24 hours (86400000 ms)
- **Refresh**: Automatic on valid requests
- **Storage**: Client-side (localStorage recommended)

## 📋 Response Format

### Success Response:
```json
{
  "status": "success",
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response:
```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2024-12-24T10:30:00Z"
}
```

## 🔑 Authentication Endpoints

### 1. User Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@mitaoe.ac.in",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@mitaoe.ac.in",
    "role": "TEACHER",
    "isEmailVerified": true
  },
  "expiresIn": 86400000
}
```

### 2. User Registration (Disabled)
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "employeeId": "EMP001",
  "email": "john.doe@mitaoe.ac.in",
  "phone": "9876543210",
  "password": "password123",
  "specialization": "Computer Science",
  "departmentId": 1
}
```

### 3. Email Verification
```http
GET /auth/verify-email?token=<verification_token>
```

### 4. Forgot Password
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@mitaoe.ac.in"
}
```

### 5. Reset Password
```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "<reset_token>",
  "newPassword": "newPassword123"
}
```

### 6. Change First Password
```http
POST /auth/change-first-password
Content-Type: application/json

{
  "email": "staff@mitaoe.ac.in",
  "currentPassword": "mitaoe@123",
  "newPassword": "newPassword123"
}
```

### 7. Generate Password Hash (Utility)
```http
POST /auth/
Content-Type: application/json

{
  "password": "plainTextPassword"
}
```

## 👨‍🏫 Teacher Endpoints

### 1. Get All Teachers
```http
GET /api/teachers
Authorization: Bearer <token>
```

### 2. Get Teacher by ID
```http
GET /api/teachers/{id}
Authorization: Bearer <token>
```

### 3. Get Current User Profile
```http
GET /api/teachers/profile
Authorization: Bearer <token>
```

### 4. Update Current User Profile
```http
PUT /api/teachers/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "9876543210",
  "specialization": "AI & Machine Learning",
  "weeklyHoursLimit": 30
}
```

### 5. Create Teacher (Admin Only)
```http
POST /api/teachers
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Prof. Jane Doe",
  "employeeId": "EMP001",
  "email": "jane.doe@mitaoe.ac.in",
  "phone": "9876543210",
  "weeklyHoursLimit": 25,
  "specialization": "Data Structures, Algorithms",
  "isActive": true,
  "password": "password123",
  "role": "TEACHER",
  "department": {
    "id": 1
  }
}
```

## 👨‍💼 Admin Endpoints

### Academic Years

#### 1. Get All Academic Years
```http
GET /admin/api/academic-years
Authorization: Bearer <admin_token>
```

#### 2. Create Academic Year
```http
POST /admin/api/academic-years
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "yearName": "2024-25",
  "startDate": "2024-07-01",
  "endDate": "2025-06-30",
  "isCurrent": true
}
```

#### 3. Update Academic Year
```http
PUT /admin/api/academic-years/{id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "yearName": "2024-25 Updated",
  "startDate": "2024-07-01",
  "endDate": "2025-06-30",
  "isCurrent": true
}
```

#### 4. Get Current Academic Year
```http
GET /admin/api/academic-years/current
Authorization: Bearer <admin_token>
```

### Departments

#### 1. Get All Departments
```http
GET /admin/api/departments
Authorization: Bearer <admin_token>
```

#### 2. Get Departments by Academic Year
```http
GET /admin/api/departments/academic-year/{academicYearId}
Authorization: Bearer <admin_token>
```

#### 3. Create Department
```http
POST /admin/api/departments
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Computer Engineering",
  "code": "COMP",
  "headOfDepartment": "Dr. John Smith",
  "years": "1,2,3,4",
  "academicYear": {
    "id": 1
  }
}
```

#### 4. Copy Departments Between Academic Years
```http
POST /admin/api/departments/copy
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "sourceAcademicYearId": 1,
  "targetAcademicYearId": 2,
  "departmentIds": [1, 2, 3]
}
```

### Courses

#### 1. Get All Courses
```http
GET /admin/api/courses
Authorization: Bearer <admin_token>
```

#### 2. Create Course
```http
POST /admin/api/courses
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Data Structures",
  "code": "CS201",
  "courseType": "THEORY",
  "credits": 4,
  "hoursPerWeek": 4,
  "semester": "SEM_3",
  "year": 2,
  "description": "Introduction to data structures",
  "isActive": true,
  "department": {
    "id": 1
  }
}
```

**Course Types:**
- `THEORY` - Theoretical courses
- `LAB` - Laboratory courses  
- `TUTORIAL` - Tutorial sessions

**Semesters:**
- `SEM_1` to `SEM_8` (Year 1: SEM_1/SEM_2, Year 2: SEM_3/SEM_4, etc.)

### Divisions

#### 1. Get All Divisions
```http
GET /admin/api/divisions
Authorization: Bearer <admin_token>
```

#### 2. Get Divisions by Academic Year
```http
GET /admin/api/divisions/academic-year/{academicYearId}
Authorization: Bearer <admin_token>
```

#### 3. Create Division
```http
POST /admin/api/divisions
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "A",
  "year": 2,
  "branch": "Computer Science",
  "totalStudents": 60,
  "timeSlotType": "TYPE_1",
  "classTeacher": "Prof. Jane Smith",
  "classRepresentative": "John Doe",
  "isActive": true,
  "department": {
    "id": 1
  },
  "academicYear": {
    "id": 1
  }
}
```

**Time Slot Types:**
- `TYPE_1` - Schedule 1 (Standard timing)
- `TYPE_2` - Schedule 2 (Alternative timing for overlapping lunch breaks)

### Batches

#### 1. Get All Batches
```http
GET /admin/api/batches
Authorization: Bearer <admin_token>
```

#### 2. Get Batches by Division
```http
GET /admin/api/batches/division/{divisionId}
Authorization: Bearer <admin_token>
```

#### 3. Create Batch
```http
POST /admin/api/batches
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "B1",
  "division": {
    "id": 1
  }
}
```

### Time Slots

#### 1. Get All Time Slots
```http
GET /admin/api/time-slots
Authorization: Bearer <admin_token>
```

#### 2. Get Time Slots by Type
```http
GET /admin/api/time-slots/type/{type}
Authorization: Bearer <admin_token>
```

#### 3. Create Time Slot
```http
POST /admin/api/time-slots
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "slotName": "Period 1",
  "startTime": "09:00:00",
  "endTime": "10:00:00",
  "type": "TYPE_1",
  "isBreak": false,
  "isActive": true
}
```

#### 4. Create Break Time Slot
```http
POST /admin/api/time-slots
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "slotName": "Lunch Break",
  "startTime": "12:00:00",
  "endTime": "13:00:00",
  "type": "TYPE_2",
  "isBreak": true,
  "isActive": true
}
```

### Rooms

#### 1. Get All Rooms
```http
GET /admin/api/rooms
Authorization: Bearer <admin_token>
```

#### 2. Create Room
```http
POST /admin/api/rooms
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "CS Lab 1",
  "roomNumber": "CS-101",
  "capacity": 60,
  "roomType": "LAB",
  "hasProjector": true,
  "hasAc": true,
  "equipment": "60 computers, projector, whiteboard",
  "building": "Main Building",
  "wing": "A Wing",
  "floor": 1,
  "isActive": true,
  "department": {
    "id": 1
  }
}
```

**Room Types:**
- `CLASSROOM` - Regular classroom
- `LAB` - Laboratory
- `AUDITORIUM` - Large auditorium
- `SEMINAR_HALL` - Seminar hall

## 👥 Staff Management Endpoints

### 1. Get Pending Staff Approvals
```http
GET /api/teachers/pending-approvals
Authorization: Bearer <admin_token>
```

### 2. Approve Staff
```http
POST /api/teachers/{id}/approve
Authorization: Bearer <admin_token>
```

### 3. Reject Staff
```http
POST /api/teachers/{id}/reject
Authorization: Bearer <admin_token>
Content-Type: application/json

"Reason for rejection"
```

### 4. Bulk Staff Upload
```http
POST /admin/upload-staff
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

file: <csv_file>
```

**CSV Format:**
```csv
Name,Employee ID,Email,Phone,Specialization,Department ID,Weekly Hours Limit
Prof. John Doe,EMP001,john.doe@mitaoe.ac.in,9876543210,Computer Science,1,25
```

### 5. Download Staff Template
```http
GET /admin/download-staff-template
Authorization: Bearer <admin_token>
```

### 6. Create Staff Manually
```http
POST /admin/create-staff
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Prof. John Doe",
  "employeeId": "EMP123",
  "email": "john.doe@mitaoe.ac.in",
  "phone": "9876543210",
  "specialization": "Computer Science",
  "departmentId": 1,
  "weeklyHoursLimit": 25
}
```

### 7. Update Staff
```http
PUT /admin/update-staff/{id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Prof. John Doe Updated",
  "phone": "9876543210",
  "specialization": "AI & Machine Learning",
  "weeklyHoursLimit": 30,
  "isActive": true
}
```

### 8. Bulk Course Upload
```http
POST /admin/upload-courses
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

file: <csv_file>
departmentId: 1
year: 2
```

**CSV Format:**
```csv
Name,Code,Type,Credits,Hours Per Week,Semester
Data Structures,CS201,THEORY,4,4,3
Database Lab,CS202,LAB,2,4,3
```

### 9. Download Courses Template
```http
GET /admin/download-courses-template
Authorization: Bearer <admin_token>
```

## 👤 Staff Profile Endpoints

### 1. Get Staff Profile
```http
GET /api/staff/profile
Authorization: Bearer <token>
```

### 2. Update Staff Profile (Restricted)
```http
PUT /api/staff/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "9876543210",
  "specialization": "Updated Specialization"
}
```

### 3. Change Staff Password
```http
POST /api/staff/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

## 📊 Data Models

### User/Teacher Model
```json
{
  "id": 1,
  "name": "Prof. John Doe",
  "employeeId": "EMP001",
  "email": "john.doe@mitaoe.ac.in",
  "phone": "9876543210",
  "role": "TEACHER",
  "specialization": "Computer Science",
  "weeklyHoursLimit": 25,
  "isActive": true,
  "isEmailVerified": true,
  "department": {
    "id": 1,
    "name": "Computer Engineering",
    "code": "COMP"
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Academic Year Model
```json
{
  "id": 1,
  "yearName": "2024-25",
  "startDate": "2024-07-01",
  "endDate": "2025-06-30",
  "isCurrent": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Department Model
```json
{
  "id": 1,
  "name": "Computer Engineering",
  "code": "COMP",
  "headOfDepartment": "Dr. John Smith",
  "years": "1,2,3,4",
  "academicYear": {
    "id": 1,
    "yearName": "2024-25"
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Division Model
```json
{
  "id": 1,
  "name": "A",
  "year": 2,
  "branch": "Computer Science",
  "totalStudents": 60,
  "timeSlotType": "TYPE_1",
  "classTeacher": "Prof. Jane Smith",
  "classRepresentative": "John Doe",
  "isActive": true,
  "department": {
    "id": 1,
    "name": "Computer Engineering"
  },
  "academicYear": {
    "id": 1,
    "yearName": "2024-25"
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Course Model
```json
{
  "id": 1,
  "name": "Data Structures",
  "code": "CS201",
  "courseType": "THEORY",
  "credits": 4,
  "hoursPerWeek": 4,
  "semester": "SEM_3",
  "year": 2,
  "description": "Introduction to data structures",
  "isActive": true,
  "department": {
    "id": 1,
    "name": "Computer Engineering"
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Time Slot Model
```json
{
  "id": 1,
  "slotName": "Period 1",
  "startTime": "09:00:00",
  "endTime": "10:00:00",
  "type": "TYPE_1",
  "isBreak": false,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## ❌ Error Codes

### Authentication Errors
- `AUTH_001` - Invalid credentials
- `AUTH_002` - Token expired
- `AUTH_003` - Token invalid
- `AUTH_004` - Email not verified
- `AUTH_005` - Account not active
- `AUTH_006` - Insufficient permissions

### Validation Errors
- `VAL_001` - Required field missing
- `VAL_002` - Invalid email format
- `VAL_003` - Invalid phone format
- `VAL_004` - Password too weak
- `VAL_005` - Invalid date format
- `VAL_006` - Invalid enum value

### Business Logic Errors
- `BUS_001` - Duplicate record
- `BUS_002` - Record not found
- `BUS_003` - Cannot delete referenced record
- `BUS_004` - Time slot overlap
- `BUS_005` - Academic year conflict
- `BUS_006` - Department capacity exceeded

### System Errors
- `SYS_001` - Database connection error
- `SYS_002` - Email service unavailable
- `SYS_003` - File upload error
- `SYS_004` - External service error

## 📝 Rate Limiting

### Limits:
- **Authentication endpoints**: 5 requests per minute per IP
- **File upload endpoints**: 10 requests per hour per user
- **General API endpoints**: 100 requests per minute per user
- **Bulk operations**: 5 requests per hour per user

### Headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 🔍 Filtering and Pagination

### Query Parameters:
```http
GET /admin/api/courses?page=0&size=20&sort=name,asc&search=data
```

### Parameters:
- `page` - Page number (0-based)
- `size` - Page size (default: 20, max: 100)
- `sort` - Sort field and direction (e.g., `name,asc`)
- `search` - Search term for name/code fields

### Response:
```json
{
  "content": [...],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20,
    "sort": {
      "sorted": true,
      "direction": "ASC",
      "property": "name"
    }
  },
  "totalElements": 150,
  "totalPages": 8,
  "first": true,
  "last": false
}
```

## 🧪 Testing

### Postman Collection
Import the provided Postman collection: `SamaySetu_Postman_Collection.json`

### Environment Variables:
```json
{
  "base_url": "http://localhost:8083",
  "jwt_token": "",
  "verification_token": "",
  "reset_token": ""
}
```

### Test Sequence:
1. Generate password hash (if needed)
2. Register user (if enabled)
3. Verify email
4. Login and get JWT token
5. Test protected endpoints

## 📞 Support

For API issues:
- Check response status codes and error messages
- Verify JWT token validity and permissions
- Ensure request format matches documentation
- Check rate limiting headers

---

**API Documentation for MIT Academy of Engineering**

© 2024 MIT Academy of Engineering - SamaySetu Development Team