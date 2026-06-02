# Database Schema Reference

> [!IMPORTANT]
> This document provides a high-level reference of the data model. Actual column definitions, constraints, indexes, and migration scripts are maintained in the private production repository.

---

## Entity-Relationship Overview

```mermaid
erDiagram
    ACADEMIC_YEAR {
        Long id PK
        String name
        String startDate
        String endDate
        Boolean isCurrent
    }

    DEPARTMENT {
        Long id PK
        String name
        Long academicYearId FK
    }

    DIVISION {
        Long id PK
        String name
        String branch
        Integer totalStudents
        String timeSlotType
        String classTeacher
        Long departmentId FK
        Long academicYearId FK
    }

    BATCH {
        Long id PK
        String name
        Integer strength
        Long divisionId FK
    }

    COURSE {
        Long id PK
        String name
        String code
        String shortName
        CourseType courseType
        CourseCategory category
        Integer credits
        Integer hoursPerWeek
        Semester semester
        Long departmentId FK
    }

    TEACHER {
        Long id PK
        String name
        String shortName
        String email
        String employeeId
        Role role
        Long departmentId FK
        Integer weeklyHourLimit
    }

    CLASSROOM {
        Long id PK
        String roomNumber
        String name
        RoomType roomType
        Integer capacity
        String building
        String wing
        Long departmentId FK
    }

    TIME_SLOT {
        Long id PK
        String slotName
        String startTime
        String endTime
        String type
        Boolean isBreak
        Boolean isActive
    }

    TIMETABLE_ENTRY {
        Long id PK
        DayOfWeek dayOfWeek
        Semester semester
        TimetableStatus status
        Boolean isLabSession
        Long divisionId FK
        Long courseId FK
        Long teacherId FK
        Long roomId FK
        Long timeSlotId FK
        Long academicYearId FK
        Long batchId FK
        Long labSessionGroupId FK
    }

    LAB_SESSION_GROUP {
        Long id PK
        String groupName
        Long courseId FK
        Long divisionId FK
    }

    TEACHER_AVAILABILITY {
        Long id PK
        DayOfWeek dayOfWeek
        String startTime
        String endTime
        Boolean isAvailable
        Long teacherId FK
    }

    ACADEMIC_YEAR ||--o{ DEPARTMENT : "contains"
    DEPARTMENT ||--o{ DIVISION : "has"
    DEPARTMENT ||--o{ COURSE : "offers"
    DEPARTMENT ||--o{ TEACHER : "employs"
    DIVISION ||--o{ BATCH : "split into"
    DIVISION ||--o{ TIMETABLE_ENTRY : "scheduled for"
    COURSE ||--o{ TIMETABLE_ENTRY : "taught in"
    TEACHER ||--o{ TIMETABLE_ENTRY : "assigned to"
    CLASSROOM ||--o{ TIMETABLE_ENTRY : "held in"
    TIME_SLOT ||--o{ TIMETABLE_ENTRY : "at"
    BATCH }o--o| TIMETABLE_ENTRY : "attends"
    LAB_SESSION_GROUP ||--o{ TIMETABLE_ENTRY : "groups"
    TEACHER ||--o{ TEACHER_AVAILABILITY : "declares"
```

---

## Enumeration Types

### DayOfWeek
```
MONDAY | TUESDAY | WEDNESDAY | THURSDAY | FRIDAY | SATURDAY
```

### Semester
```
SEM_1 | SEM_2 | SEM_3 | SEM_4 | SEM_5 | SEM_6 | SEM_7 | SEM_8
```

### TimetableStatus
```
DRAFT | PUBLISHED | ARCHIVED
```

### CourseType
```
THEORY | LAB
```

### CourseCategory
```
CORE | ELECTIVE
```

### RoomType
```
CLASSROOM | LAB
```

### Role (Teacher)
```
TEACHER | TIMETABLE_COORDINATOR | HOD | DEPARTMENT_ADMIN | ADMIN | SUPER_ADMIN
```

---

## Key Relationships

| Relationship | Cardinality | Description |
|-------------|-------------|-------------|
| AcademicYear → Department | 1:N | Departments are scoped per academic year |
| Department → Division | 1:N | Each department has multiple class divisions |
| Division → Batch | 1:N | Divisions are split into lab batches |
| Division → TimetableEntry | 1:N | Each division has many scheduled entries |
| Course → TimetableEntry | 1:N | A course appears in multiple time slots |
| Teacher → TimetableEntry | 1:N | A teacher is assigned to multiple entries |
| Classroom → TimetableEntry | 1:N | A room hosts multiple entries |
| TimeSlot → TimetableEntry | 1:N | A time slot contains entries across divisions |
| LabSessionGroup → TimetableEntry | 1:N | Groups related lab entries for atomic operations |

---

## Database Technology

| Aspect | Technology |
|--------|-----------|
| **RDBMS** | PostgreSQL 17 |
| **ORM** | Hibernate (via Spring Data JPA) |
| **Migrations** | Flyway (versioned SQL scripts) |
| **Connection Pool** | HikariCP (Spring Boot default) |
| **Cache** | Redis (cache-aside for published timetables) |
