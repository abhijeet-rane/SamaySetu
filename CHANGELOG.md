# Changelog

All notable high-level changes to the SamaySetu platform are documented here.

> [!NOTE]
> This changelog covers feature-level updates. Detailed commit history is maintained in the private production repository.

---

## [Unreleased]

### Added
- Dynamic time slot type detection across teacher dashboard, timetable, and availability pages
- Collapsible sidebar with icon-only mode, hover tooltips, and localStorage persistence
- Room/Lab PDF and Excel exports redesigned to match official institutional format
- Faculty PDF export teaching load rendered as structured table
- Course categorization system (Core / Elective)
- Faculty and Course short name support for compact timetable displays

### Fixed
- Resolved empty timetable grid rendering when divisions use non-default slot configurations (TYPE_2, etc.)
- Fixed course over-allocation after timetable publish by resetting progressive instance counters
- Corrected 403 errors on teacher dashboard by switching to public time slot API endpoint

### Removed
- Removed duplicate "Exports" admin page (consolidated into Resource Timetables page)

---

## [1.0.0] — Initial Release

### Core Platform
- Full timetable scheduling engine with drag-and-drop builder
- 8-point real-time conflict detection
- Lab session wizard with atomic multi-batch creation
- Draft → Publish → Archive lifecycle management
- Pre-publish validation dashboard

### Academic Management
- Department, Division, Batch, and Course CRUD
- Academic year management with current year flag
- Multi-schedule type support (TYPE_1, TYPE_2, etc.)

### Faculty & Access Control
- 6-role authorization model (SUPER_ADMIN through TEACHER)
- Department-scoped resource isolation
- JWT stateless authentication with BCrypt
- Account lockout, email verification, password reset flows
- Bulk CSV faculty import with template downloads

### Export Engine
- 8 export endpoints (PDF + Excel × 4 scopes)
- Institutional-grade document formatting
- Vertical break column rendering
- Lab session cell merging
- Teaching load computation tables

### Infrastructure
- Redis caching for published timetables
- Redis-backed rate limiting
- Flyway database migrations
- 5 GitHub Actions CI/CD workflows
- AWS EC2 + Vercel deployment architecture
