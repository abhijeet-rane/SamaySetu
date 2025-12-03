# SamaySetu - Intelligent College Timetable Management System

## 🎓 Project Overview

**SamaySetu** (समय सेतु - "Bridge of Time") is an advanced, automated timetable management system designed specifically for **MIT Academy of Engineering**. The system intelligently generates conflict-free class schedules while respecting complex constraints like teacher availability, room capacity, workload limits, and academic year management.

---

## 🎯 Core Problem Statement

### Current Challenges in Manual Timetable Creation:
- ⏰ **Time-Consuming**: Takes 2-3 weeks to create a single semester timetable
- ❌ **Error-Prone**: High risk of conflicts (teacher/room double-booking)
- 📊 **Difficult to Optimize**: Hard to balance teacher workload and room utilization
- 🔄 **Inflexible**: Changes require complete rework
- 📚 **No Historical Data**: Previous years' timetables are lost or hard to access
- 🎓 **Multi-Year Complexity**: Managing timetables across academic years is chaotic

### SamaySetu Solution:
✅ **Automated Generation**: Creates timetables in minutes, not weeks  
✅ **Conflict Detection**: Real-time validation prevents all scheduling conflicts  
✅ **Intelligent Optimization**: Balances workload and maximizes resource utilization  
✅ **Easy Modifications**: Quick updates with automatic conflict resolution  
✅ **Historical Archive**: Complete timetable history with academic year tracking  
✅ **Multi-Year Management**: Seamlessly handle multiple academic years simultaneously

---

## 🌟 Key Features

### 1. 📅 **Academic Year Management** (Core Feature)

The system is built around **ACADEMIC_YEARS** as the central organizing principle:

#### Why Academic Years Matter:
- **Historical Tracking**: Maintain complete records of past timetables
- **Year-over-Year Comparison**: Analyze patterns and improvements
- **Smooth Transitions**: Prepare next year's timetable while current year runs
- **Audit Trail**: Know exactly what was scheduled when
- **Regulatory Compliance**: Meet accreditation requirements for record-keeping

#### Academic Year Features:
```
ACADEMIC_YEARS Table:
├── year_name: "2024-25", "2025-26"
├── start_date: Academic year start (e.g., July 1, 2024)
├── end_date: Academic year end (e.g., June 30, 2025)
├── is_current: Flag for active academic year
└── Relationships: Links to Divisions & Timetable Entries
```

#### Use Cases:
1. **Admin creates new academic year** → System copies divisions from previous year
2. **Generate timetable for 2025-26** → While 2024-25 is still active
3. **View historical timetables** → Access any past year's complete schedule
4. **Compare workloads** → Teacher hours across multiple years
5. **Archive old data** → Move completed years to archive storage



### 2. 👥 **Role-Based Access Control**

#### **Admin Role** (Full System Control)
- ✅ Manage all master data (Departments, Teachers, Courses, Rooms)
- ✅ Create and manage Academic Years
- ✅ Generate and modify timetables
- ✅ Assign teachers to courses
- ✅ View analytics and reports
- ✅ Manage user accounts

#### **Teacher Role** (Self-Service Portal)
- ✅ View personal timetable (filtered by academic year)
- ✅ Manage availability (day/time preferences)
- ✅ Update profile information
- ✅ View assigned courses
- ✅ Check workload statistics

### 3. 🧠 **Intelligent Constraint Management**

The system automatically enforces these business rules:

#### **Teacher Constraints:**
- ✅ **No Double-Booking**: Teacher can't be in two places at once
- ✅ **Availability Respect**: Only schedule during available hours
- ✅ **Workload Limits**: Maximum 25 hours/week (configurable)
- ✅ **Course Assignment**: Can only teach assigned courses
- ✅ **Break Time**: Minimum gap between consecutive classes

#### **Room Constraints:**
- ✅ **No Conflicts**: One class per room per time slot
- ✅ **Type Matching**: Lab courses → Lab rooms, Theory → Classrooms
- ✅ **Capacity Check**: Room must accommodate division size
- ✅ **Equipment Requirements**: Match course needs with room facilities

#### **Division Constraints:**
- ✅ **Complete Coverage**: All semester courses must be scheduled
- ✅ **No Overlaps**: Students can't have two classes simultaneously
- ✅ **Balanced Distribution**: Even spread across the week
- ✅ **Academic Year Isolation**: Each year's timetable is independent

#### **Time Constraints:**
- ✅ **Working Days**: Monday to Saturday
- ✅ **Configurable Slots**: Flexible time periods
- ✅ **Break Periods**: Lunch, tea breaks (non-schedulable)
- ✅ **Duration Validation**: Courses get appropriate time slots

### 4. 📊 **Comprehensive Data Management**

#### **Master Data Entities:**

**Departments**
- Computer Science, IT, Mechanical, Civil, etc.
- Department code, HOD information
- Links to teachers, courses, rooms, divisions

**Teachers**
- Personal info (name, employee ID, email, phone)
- Department assignment
- Specialization areas
- Weekly hour limits
- Active/Inactive status

**Courses**
- Course name, code, type (Theory/Lab)
- Credits, hours per week
- Semester (1-8)
- Department, prerequisites
- Description

**Rooms**
- Room name, number, type
- Capacity, department
- Equipment (projector, AC, lab equipment)
- Active status

**Divisions**
- Name (A, B, C), Year (1-4), Branch
- Department, Academic Year
- Total students
- Active status

**Time Slots**
- Start time, end time, duration
- Slot name (e.g., "Period 1")
- Break flag
- Active status



### 5. 🔐 **Security & Authentication**

#### **Email-Based Authentication**
- ✅ College email validation (@mitaoe.ac.in only)
- ✅ Email verification required before access
- ✅ Secure password reset flow
- ✅ JWT token-based sessions

#### **Security Features**
- ✅ Role-based access control (RBAC)
- ✅ Password encryption (BCrypt)
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CSRF tokens
- ✅ Audit logging

### 6. 📈 **Analytics & Reports**

#### **Teacher Workload Analysis**
- Current weekly hours vs. limit
- Distribution across days
- Year-over-year comparison
- Overloaded teacher alerts

#### **Room Utilization**
- Occupancy percentage
- Peak usage times
- Underutilized rooms
- Equipment usage stats

#### **Division Coverage**
- Course completion status
- Hours per subject
- Teacher distribution
- Schedule balance

---

## 🏗️ System Architecture

### **Technology Stack**

#### **Backend (Spring Boot)**
```
├── Framework: Spring Boot 3.x
├── Language: Java 17+
├── Database: MySQL 8.0
├── Security: Spring Security + JWT
├── Email: JavaMailSender
├── Validation: Hibernate Validator
└── API: RESTful endpoints
```

#### **Frontend (React + TypeScript)**
```
├── Framework: React 18 + Vite
├── Language: TypeScript
├── Styling: Tailwind CSS
├── Routing: React Router v6
├── State: Zustand
├── HTTP: Axios
├── Animations: Framer Motion
└── Notifications: React Hot Toast
```

#### **Database (MySQL)**
```
├── 11 Core Tables
├── 6 Stored Procedures
├── 2 Triggers (Constraint Validation)
├── 3 Views (Optimized Queries)
└── Comprehensive Indexing
```

### **System Components**

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Auth Pages │  │    Teacher   │  │    Admin     │  │
│  │              │  │   Dashboard  │  │  Dashboard   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ REST API (JSON)
┌────────────────────────▼────────────────────────────────┐
│                 BACKEND (Spring Boot)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Controllers  │  │   Services   │  │ Repositories │  │
│  │  (REST API)  │  │   (Logic)    │  │    (JPA)     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │   Security   │  │    Email     │                    │
│  │  (JWT/Auth)  │  │   Service    │                    │
│  └──────────────┘  └──────────────┘                    │
└────────────────────────┬────────────────────────────────┘
                         │ JDBC
┌────────────────────────▼────────────────────────────────┐
│                   DATABASE (MySQL)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    Tables    │  │   Triggers   │  │    Views     │  │
│  │  (11 Core)   │  │ (Validation) │  │ (Optimized)  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │   Stored     │  │   Indexes    │                    │
│  │  Procedures  │  │ (Performance)│                    │
│  └──────────────┘  └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
```



---

## 🔄 Data Flow & Workflows

### **Workflow 1: Creating a New Academic Year**

```
1. Admin logs in → Admin Dashboard
2. Navigate to "Academic Years" page
3. Click "Create New Academic Year"
4. Fill form:
   - Year Name: "2025-26"
   - Start Date: July 1, 2025
   - End Date: June 30, 2026
   - Set as Current: No (prepare in advance)
5. System validates:
   ✓ No overlapping dates with existing years
   ✓ End date > Start date
   ✓ Unique year name
6. On save:
   - Create academic year record
   - Option to copy divisions from previous year
   - Initialize empty timetable structure
7. Success: "Academic Year 2025-26 created successfully"
```

### **Workflow 2: Generating a Timetable**

```
1. Admin selects Academic Year: "2024-25"
2. Navigate to "Timetable Management"
3. Select Division: "SE-A (Computer Science)"
4. View required courses for semester
5. For each course:
   a. Select Teacher (from assigned teachers)
   b. Select Room (matching course type)
   c. Select Time Slot
   d. Select Day of Week
6. System validates in real-time:
   ✓ Teacher available at this time
   ✓ Teacher not double-booked
   ✓ Room not double-booked
   ✓ Teacher weekly hours not exceeded
   ✓ Room type matches course type
7. If valid → Save entry
8. If conflict → Show specific error message
9. Repeat until all courses scheduled
10. Generate PDF/Excel report
```

### **Workflow 3: Teacher Views Timetable**

```
1. Teacher logs in → Teacher Dashboard
2. System shows current academic year by default
3. Teacher can switch academic year (dropdown)
4. View personal timetable:
   - Weekly grid view
   - Filtered by teacher ID
   - Shows: Course, Division, Room, Time
5. View statistics:
   - Total weekly hours
   - Classes per day
   - Assigned courses
6. Export personal timetable (PDF)
```

### **Workflow 4: Managing Teacher Availability**

```
1. Teacher → Availability Page
2. View current availability settings
3. For each day (Monday-Saturday):
   - Set available time ranges
   - Example: Monday 9:00 AM - 5:00 PM
   - Can add multiple ranges per day
4. Mark unavailable days (holidays, leaves)
5. Save changes
6. System validates:
   ✓ End time > Start time
   ✓ No overlapping ranges
7. Admin sees updated availability
8. Timetable generation respects these constraints
```

---

## 📊 Database Schema Highlights

### **Core Tables & Relationships**

```
ACADEMIC_YEARS (Central Hub)
    ├── 1:N → DIVISIONS
    │         └── 1:N → TIMETABLE_ENTRIES
    └── 1:N → TIMETABLE_ENTRIES

DEPARTMENTS
    ├── 1:N → TEACHERS
    ├── 1:N → COURSES
    ├── 1:N → ROOMS
    └── 1:N → DIVISIONS

TEACHERS
    ├── 1:N → TEACHER_AVAILABILITY
    ├── M:N → COURSES (via TEACHER_COURSES)
    └── 1:N → TIMETABLE_ENTRIES

TIMETABLE_ENTRIES (Core Scheduling Table)
    ├── N:1 → ACADEMIC_YEARS
    ├── N:1 → DIVISIONS
    ├── N:1 → COURSES
    ├── N:1 → TEACHERS
    ├── N:1 → ROOMS
    └── N:1 → TIME_SLOTS
```

### **Key Constraints**

#### **Database-Level Enforcement:**
- Foreign Keys: Referential integrity
- Unique Constraints: Prevent duplicates
- Check Constraints: Validate ranges
- Triggers: Complex business rules
- Stored Procedures: Centralized validation

#### **Application-Level Validation:**
- JPA Annotations: @NotNull, @Size, @Email
- Service Layer: Business logic
- Custom Validators: Complex rules
- Transaction Management: Atomicity



---

## 🎨 User Interface Design

### **Design Principles**
- 🎨 **MIT AOE Brand Colors**: Navy Blue (#1a237e) + Cyan (#00bcd4)
- 📱 **Responsive**: Works on desktop, tablet, mobile
- ♿ **Accessible**: WCAG 2.1 compliant
- ⚡ **Fast**: Optimized performance
- 🎭 **Intuitive**: Minimal learning curve

### **Key UI Components**

#### **Authentication Pages**
- Login with college email
- Registration with email verification
- Password reset flow
- Clean, professional design

#### **Teacher Dashboard**
```
┌─────────────────────────────────────────────────────┐
│  Navbar: Logo | SamaySetu | User Menu | Logout     │
├─────────────────────────────────────────────────────┤
│ Sidebar │ Main Content Area                         │
│         │                                            │
│ 🏠 Dashboard                                         │
│ 📅 My Timetable  ┌──────────────────────────────┐  │
│ ⏰ Availability  │  Welcome back, Prof. Name!   │  │
│ 👤 Profile       │                              │  │
│                  │  📊 Stats Cards:             │  │
│                  │  - Total Classes: 24         │  │
│                  │  - This Week: 8              │  │
│                  │  - Hours/Week: 16            │  │
│                  │                              │  │
│                  │  📅 Today's Schedule         │  │
│                  │  📈 Quick Actions            │  │
│                  └──────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

#### **Admin Dashboard**
```
┌─────────────────────────────────────────────────────┐
│  Navbar: Logo | SamaySetu | User Menu | Logout     │
├─────────────────────────────────────────────────────┤
│ Sidebar │ Main Content Area                         │
│         │                                            │
│ 🏠 Dashboard                                         │
│ 🏢 Departments   ┌──────────────────────────────┐  │
│ 👨‍🏫 Teachers      │  Admin Dashboard 👑          │  │
│ 📚 Courses       │                              │  │
│ 🏫 Rooms         │  📊 System Stats:            │  │
│ 📅 Academic Years│  - Total Teachers: 45        │  │
│ 👥 Divisions     │  - Total Courses: 120        │  │
│ ⏰ Time Slots    │  - Departments: 8            │  │
│ 📋 Timetables    │  - Academic Years: 3         │  │
│                  │                              │  │
│                  │  🚀 Quick Actions            │  │
│                  │  📈 Recent Activity          │  │
│                  └──────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### **Timetable Grid View**

```
┌─────────────────────────────────────────────────────────────┐
│  Division: SE-A (Computer Science) | Academic Year: 2024-25 │
├──────┬──────────┬──────────┬──────────┬──────────┬──────────┤
│ Time │  Monday  │ Tuesday  │Wednesday │ Thursday │  Friday  │
├──────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ 9-10 │ Data Str │ Algo     │ DBMS     │ OS       │ Networks │
│      │ Prof. A  │ Prof. B  │ Prof. C  │ Prof. D  │ Prof. E  │
│      │ Room 101 │ Room 102 │ Lab 1    │ Room 103 │ Lab 2    │
├──────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│10-11 │ Algo Lab │ Data Str │ Networks │ DBMS     │ OS       │
│      │ Prof. B  │ Prof. A  │ Prof. E  │ Prof. C  │ Prof. D  │
│      │ Lab 3    │ Room 101 │ Room 104 │ Lab 1    │ Room 103 │
├──────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│11-12 │  BREAK   │  BREAK   │  BREAK   │  BREAK   │  BREAK   │
└──────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

---

## 🚀 Implementation Roadmap

### **Phase 1: Foundation (25% - Current Target)**

#### ✅ **Completed**
- [x] Database schema design
- [x] Backend authentication (JWT)
- [x] Email verification system
- [x] Frontend authentication pages
- [x] Teacher dashboard structure
- [x] Admin dashboard structure
- [x] Departments CRUD
- [x] Teachers CRUD (partial)

#### 🚧 **In Progress**
- [ ] Fix dashboard content alignment
- [ ] Complete Teachers CRUD
- [ ] Academic Years CRUD
- [ ] Courses CRUD
- [ ] Rooms CRUD
- [ ] Divisions CRUD
- [ ] Time Slots CRUD

### **Phase 2: Core Functionality (50%)**
- [ ] Teacher-Course assignment
- [ ] Teacher availability management
- [ ] Basic timetable creation (manual)
- [ ] Conflict detection
- [ ] Timetable viewing (grid)
- [ ] PDF export

### **Phase 3: Intelligence (75%)**
- [ ] Automated timetable generation
- [ ] Optimization algorithms
- [ ] Workload balancing
- [ ] Room utilization optimization
- [ ] Analytics dashboard
- [ ] Reports generation

### **Phase 4: Polish (100%)**
- [ ] Advanced filters
- [ ] Bulk operations
- [ ] Import/Export (Excel)
- [ ] Notifications
- [ ] Audit logs
- [ ] Performance optimization
- [ ] Mobile app (optional)



---

## 💡 Key Innovations

### **1. Academic Year-Centric Design**
Unlike traditional systems that treat timetables as standalone entities, SamaySetu organizes everything around academic years. This enables:
- **Historical Preservation**: Never lose past timetables
- **Parallel Planning**: Prepare next year while current year runs
- **Trend Analysis**: Compare patterns across years
- **Compliance**: Meet regulatory record-keeping requirements

### **2. Real-Time Conflict Detection**
Instead of discovering conflicts after generation, SamaySetu validates every entry immediately:
- **Instant Feedback**: Know immediately if a slot is valid
- **Specific Errors**: "Prof. Sharma already teaching SE-B at this time"
- **Suggestion Engine**: "Available slots for Prof. Sharma: ..."

### **3. Intelligent Workload Balancing**
The system doesn't just prevent overload, it actively balances:
- **Fair Distribution**: Even spread across teachers
- **Preference Respect**: Honor availability preferences
- **Optimization**: Minimize gaps in teacher schedules

### **4. Multi-Level Validation**
Three layers of protection ensure data integrity:
- **Frontend**: Immediate user feedback
- **Backend**: Business logic enforcement
- **Database**: Triggers and constraints

---

## 📈 Expected Benefits

### **For Administration**
- ⏱️ **Time Savings**: 95% reduction in timetable creation time
- 💰 **Cost Reduction**: Less manual effort, fewer errors
- 📊 **Better Planning**: Data-driven decisions
- 🎯 **Resource Optimization**: Maximize room and teacher utilization
- 📚 **Compliance**: Easy audit trail and reporting

### **For Teachers**
- 👀 **Transparency**: Always know your schedule
- 🎯 **Control**: Set your availability preferences
- 📱 **Accessibility**: View timetable anytime, anywhere
- ⚖️ **Fairness**: Balanced workload distribution
- 📊 **Insights**: Understand your teaching patterns

### **For Students** (Future)
- 📅 **Easy Access**: View class schedules online
- 🔔 **Notifications**: Get alerts for changes
- 📍 **Room Finder**: Know where to go
- 👨‍🏫 **Teacher Info**: Contact details, office hours

### **For Institution**
- 🏆 **Reputation**: Modern, efficient operations
- 📈 **Accreditation**: Better documentation
- 💡 **Innovation**: Showcase technological advancement
- 🎓 **Student Satisfaction**: Fewer scheduling issues

---

## 🔒 Security & Privacy

### **Data Protection**
- 🔐 **Encryption**: All sensitive data encrypted
- 🛡️ **Access Control**: Role-based permissions
- 📝 **Audit Logs**: Track all changes
- 🔑 **Secure Authentication**: JWT tokens, password hashing
- 🌐 **HTTPS**: Encrypted communication

### **Privacy Compliance**
- ✅ Only college emails allowed
- ✅ Minimal personal data collection
- ✅ Data retention policies
- ✅ User consent for email notifications
- ✅ Right to access/delete data

---

## 🛠️ Technical Specifications

### **Performance Requirements**
- ⚡ Page load time: < 2 seconds
- 🚀 API response time: < 500ms
- 📊 Support 1000+ concurrent users
- 💾 Database size: Scalable to 10+ years of data
- 🔄 Backup: Daily automated backups

### **Browser Support**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### **Server Requirements**
- **Backend**: 4GB RAM, 2 CPU cores
- **Database**: 8GB RAM, 4 CPU cores, 50GB storage
- **Frontend**: Static hosting (Netlify/Vercel)

---

## 📚 Documentation Structure

```
SamaySetu/
├── PROJECT_DESCRIPTION.md (This file)
├── DATABASE_SCHEMA_DETAILED.md
├── API_DOCUMENTATION.md
├── USER_MANUAL.md
├── DEVELOPER_GUIDE.md
├── DEPLOYMENT_GUIDE.md
└── TROUBLESHOOTING.md
```

---

## 🎓 Academic Context

### **MIT Academy of Engineering**
- **Location**: Alandi(D), Pune - 412 105, Maharashtra, India
- **Departments**: Computer, IT, Mechanical, Civil, E&TC, etc.
- **Students**: 2000+ across 4 years
- **Faculty**: 100+ teachers
- **Working Days**: Monday to Saturday
- **Semesters**: 8 (4 years × 2 semesters)

### **Typical Semester Structure**
- **Duration**: 16-18 weeks
- **Courses per Semester**: 6-8
- **Theory Classes**: 3-4 hours/week per course
- **Lab Classes**: 2-4 hours/week per course
- **Total Hours**: 24-30 hours/week per division

---

## 🤝 Stakeholders

### **Primary Users**
1. **System Admin**: IT department staff
2. **Academic Admin**: HODs, Dean
3. **Teachers**: Faculty members
4. **Students**: (Future phase)

### **Secondary Users**
1. **Management**: For reports and analytics
2. **Accreditation Bodies**: For compliance
3. **Parents**: (Future - view student schedules)

---

## 📞 Support & Maintenance

### **Support Channels**
- 📧 Email: support@samaysetu.mitaoe.ac.in
- 📱 Phone: +91-XXXX-XXXXXX
- 💬 In-app chat support
- 📚 Knowledge base

### **Maintenance Schedule**
- **Daily**: Automated backups
- **Weekly**: Performance monitoring
- **Monthly**: Security updates
- **Quarterly**: Feature updates
- **Yearly**: Major version releases

---

## 🌟 Future Enhancements

### **Short-term (6 months)**
- Mobile app (Android/iOS)
- WhatsApp notifications
- Bulk import from Excel
- Advanced analytics dashboard

### **Medium-term (1 year)**
- AI-powered timetable generation
- Predictive conflict detection
- Student portal
- Parent portal
- Attendance integration

### **Long-term (2+ years)**
- Multi-campus support
- Exam scheduling
- Resource booking (labs, auditoriums)
- Integration with LMS
- Smart classroom integration

---

## 📊 Success Metrics

### **Quantitative**
- ✅ 95% reduction in timetable creation time
- ✅ 100% conflict-free schedules
- ✅ 90% teacher satisfaction
- ✅ 85% room utilization
- ✅ Zero scheduling errors

### **Qualitative**
- ✅ Improved teacher work-life balance
- ✅ Better resource utilization
- ✅ Enhanced institutional reputation
- ✅ Streamlined administrative processes
- ✅ Data-driven decision making

---

## 🏁 Conclusion

**SamaySetu** represents a paradigm shift in how educational institutions manage their most critical resource: **time**. By combining intelligent automation with user-friendly design and robust academic year management, the system transforms a weeks-long manual process into a minutes-long automated one.

The **Academic Year-centric architecture** ensures that the institution can:
- 📚 Maintain complete historical records
- 🔄 Seamlessly transition between years
- 📊 Analyze trends and patterns
- ✅ Meet compliance requirements
- 🚀 Plan for the future while managing the present

With SamaySetu, MIT Academy of Engineering will have a **modern, efficient, and intelligent** timetable management system that serves as a foundation for future innovations in academic administration.

---

## 📄 License & Credits

**Project**: SamaySetu - Intelligent Timetable Management System  
**Institution**: MIT Academy of Engineering, Pune  
**Development**: Final Year Project 2024-25  
**Technology**: Spring Boot + React + MySQL  
**License**: Proprietary (MIT AOE)

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: In Development (25% Complete)

