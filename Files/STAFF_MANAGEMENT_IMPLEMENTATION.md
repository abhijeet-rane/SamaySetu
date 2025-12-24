# Staff Management System Implementation

## Overview
Implemented a comprehensive staff management system where admin can upload staff details via CSV and staff must change their default password on first login.

## Key Features Implemented

### 1. **Admin CSV Upload System**
- **File**: `AdminController.java`, `AdminService.java`
- **Frontend**: `StaffUploadPage.tsx`
- Admin can upload CSV files with staff details
- Automatic validation and duplicate checking
- Bulk creation of staff accounts

### 2. **Default Password System**
- All new staff get default password: `mitaoe@123`
- Password is automatically encoded before storage
- Staff cannot use the default password as their new password

### 3. **Mandatory First-Time Password Change**
- **Backend**: Added `isFirstLogin` field to `TeacherEntity`
- **Frontend**: `ChangeFirstPasswordPage.tsx`
- Users are redirected to password change on first login
- Cannot access system until password is changed

### 4. **Weekly Hours Range System**
- **Old**: Single `weeklyHoursLimit` field
- **New**: `minWeeklyHours` and `maxWeeklyHours` fields
- Provides flexibility for scheduling
- Validation: Min (1-40), Max (1-50), Max ≥ Min

### 5. **Field Access Control**
- **Admin-Only Fields** (Fixed for staff):
  - Name (official institutional record)
  - Employee ID
  - Email
  - Department
  - Role
  - Weekly Hours Limits (Min/Max range)
  - Account Status

- **Staff-Editable Fields**:
  - Phone
  - Specialization
  - Password

## Database Changes

### New Fields Added to `teachers` table:
```sql
- min_weekly_hours INTEGER DEFAULT 10
- max_weekly_hours INTEGER DEFAULT 30  
- is_first_login BOOLEAN DEFAULT TRUE
```

### Constraints Added:
```sql
- CHECK (min_weekly_hours >= 1 AND min_weekly_hours <= 40)
- CHECK (max_weekly_hours >= 1 AND max_weekly_hours <= 50)
- CHECK (max_weekly_hours >= min_weekly_hours)
```

## API Endpoints

### New Admin Endpoints:
- `POST /admin/upload-staff` - Upload CSV file with staff data
- `GET /admin/download-staff-template` - Download CSV template file

### New Auth Endpoints:
- `POST /auth/change-first-password` - Change password on first login
- Enhanced `POST /auth/login` - Returns `firstLogin` flag

### New Staff Endpoints:
- `GET /api/staff/profile` - Get restricted profile view
- `PUT /api/staff/profile` - Update only allowed fields

## CSV Format

### Required Columns:
1. Name
2. Employee ID  
3. Email
4. Phone
5. Specialization
6. Min Weekly Hours
7. Max Weekly Hours

### Sample CSV:
```csv
Name,Employee ID,Email,Phone,Specialization,Min Weekly Hours,Max Weekly Hours
John Doe,EMP001,john.doe@mitaoe.ac.in,9876543210,Computer Science,12,25
Jane Smith,EMP002,jane.smith@mitaoe.ac.in,9876543211,Mathematics,10,20
```

## Security Features

### 1. **Access Control**:
- Admin-only CSV upload endpoint
- Role-based field editing restrictions
- JWT-based authentication

### 2. **Password Security**:
- Forced password change on first login
- Minimum 6 character requirement
- Cannot reuse default password
- Passwords are bcrypt encoded

### 3. **Data Validation**:
- Email format validation (@mitaoe.ac.in)
- Unique employee ID and email constraints
- Weekly hours range validation
- CSV format validation

## Frontend Components

### 1. **StaffUploadPage.tsx**:
- Drag & drop CSV upload
- Backend-powered template download
- Upload progress and feedback
- Validation instructions
- Proper error handling for both upload and download

### 2. **ChangeFirstPasswordPage.tsx**:
- Secure password change form
- Password strength validation
- Matches login page design
- Security notices

### 3. **Enhanced Login Flow**:
- Detects first-time login
- Automatic redirect to password change
- Improved error handling

## Workflow

### Admin Workflow:
1. Admin accesses Staff Upload page
2. Downloads CSV template from backend (with sample data)
3. Fills template with actual staff data
4. Uploads completed CSV file
5. System creates accounts with default passwords
6. Staff receive login credentials

### Staff First Login:
1. Staff login with default credentials
2. System detects first login
3. Redirects to password change page
4. Must set new password to continue
5. Redirected to dashboard after password change

### Ongoing Usage:
- Staff can only edit allowed profile fields
- Admin retains control over institutional data
- Weekly hours managed by admin

## Benefits

### 1. **Administrative Efficiency**:
- Bulk staff creation via CSV
- Reduced manual data entry
- Standardized onboarding process

### 2. **Security**:
- Forced password changes
- Role-based access control
- Audit trail for changes

### 3. **Data Integrity**:
- Institutional data remains controlled
- Validation prevents errors
- Consistent data format

### 4. **User Experience**:
- Clear instructions and feedback
- Intuitive interface design
- Proper error handling

## Files Modified/Created

### Backend:
- `TeacherEntity.java` - Added new fields
- `AdminController.java` - CSV upload endpoint
- `AdminService.java` - CSV processing logic
- `AuthController.java` - First login handling
- `StaffController.java` - Restricted profile endpoints
- `TeacherService.java` - First login methods
- `AuthResponse.java` - Added firstLogin field
- `ChangeFirstPasswordRequest.java` - New DTO
- `StaffProfileUpdateRequest.java` - Restricted update DTO
- `ProfileUpdateRequest.java` - Updated for new fields

### Frontend:
- `StaffUploadPage.tsx` - Admin CSV upload interface
- `ChangeFirstPasswordPage.tsx` - First-time password change
- `LoginPage.tsx` - Enhanced login flow
- `api.ts` - New API endpoints

### Database:
- `update_teacher_table_for_staff_management.sql` - Migration script

This implementation provides a complete, secure, and user-friendly staff management system that meets all the specified requirements.