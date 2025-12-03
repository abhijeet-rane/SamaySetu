# Backend Implementation Guide

## 🔧 Current Issues

### 1. 403 Error on Page Refresh
**Problem:** JWT token not being properly restored from localStorage  
**Status:** ✅ FIXED in frontend (auth store updated)

### 2. Missing Backend Endpoints
**Problem:** Frontend expects CRUD endpoints that may not exist in backend  
**Status:** 🚧 Needs backend implementation

---

## 📋 Required Backend Endpoints

### Authentication Endpoints (✅ Likely Complete)
```
POST   /auth/register          - Register new user
POST   /auth/login             - Login user
GET    /auth/verify-email      - Verify email with token
POST   /auth/forgot-password   - Request password reset
POST   /auth/reset-password    - Reset password with token
```

### Department Endpoints (🚧 Needs Implementation)
```
GET    /admin/api/departments           - Get all departments
GET    /admin/api/departments/{id}      - Get department by ID
POST   /admin/api/departments           - Create department
PUT    /admin/api/departments/{id}      - Update department
DELETE /admin/api/departments/{id}      - Delete department
```

### Teacher Endpoints (🚧 Needs Implementation)
```
GET    /admin/api/teachers              - Get all teachers
GET    /admin/api/teachers/{id}         - Get teacher by ID
POST   /admin/api/teachers              - Create teacher
PUT    /admin/api/teachers/{id}         - Update teacher
DELETE /admin/api/teachers/{id}         - Delete teacher
```

### Course Endpoints (🚧 Needs Implementation)
```
GET    /admin/api/courses               - Get all courses
GET    /admin/api/courses/{id}          - Get course by ID
POST   /admin/api/courses               - Create course
PUT    /admin/api/courses/{id}          - Update course
DELETE /admin/api/courses/{id}          - Delete course
```

### Room Endpoints (🚧 Needs Implementation)
```
GET    /admin/api/rooms                 - Get all rooms
GET    /admin/api/rooms/{id}            - Get room by ID
POST   /admin/api/rooms                 - Create room
PUT    /admin/api/rooms/{id}            - Update room
DELETE /admin/api/rooms/{id}            - Delete room
```

### Academic Year Endpoints (🚧 Needs Implementation)
```
GET    /admin/api/academic-years        - Get all academic years
GET    /admin/api/academic-years/{id}   - Get academic year by ID
POST   /admin/api/academic-years        - Create academic year
PUT    /admin/api/academic-years/{id}   - Update academic year
DELETE /admin/api/academic-years/{id}   - Delete academic year
GET    /admin/api/academic-years/current - Get current academic year
```

### Division Endpoints (🚧 Needs Implementation)
```
GET    /admin/api/divisions             - Get all divisions
GET    /admin/api/divisions/{id}        - Get division by ID
POST   /admin/api/divisions             - Create division
PUT    /admin/api/divisions/{id}        - Update division
DELETE /admin/api/divisions/{id}        - Delete division
GET    /admin/api/divisions/academic-year/{yearId} - Get by academic year
```

### Time Slot Endpoints (🚧 Needs Implementation)
```
GET    /admin/api/time-slots            - Get all time slots
GET    /admin/api/time-slots/{id}       - Get time slot by ID
POST   /admin/api/time-slots            - Create time slot
PUT    /admin/api/time-slots/{id}       - Update time slot
DELETE /admin/api/time-slots/{id}       - Delete time slot
GET    /admin/api/time-slots/active     - Get active time slots
```

---

## 🏗️ Backend Structure

### Recommended Package Structure
```
Backend/src/main/java/com/College/timetable/
├── Controller/
│   ├── AuthController.java          ✅ (Likely exists)
│   ├── DepartmentController.java    🚧 (Needs implementation)
│   ├── TeacherController.java       🚧 (Needs implementation)
│   ├── CourseController.java        🚧 (Needs implementation)
│   ├── RoomController.java          🚧 (Needs implementation)
│   ├── AcademicYearController.java  🚧 (Needs implementation)
│   ├── DivisionController.java      🚧 (Needs implementation)
│   └── TimeSlotController.java      🚧 (Needs implementation)
├── Service/
│   ├── AuthService.java             ✅
│   ├── DepartmentService.java       🚧
│   ├── TeacherService.java          🚧
│   ├── CourseService.java           🚧
│   ├── RoomService.java             🚧
│   ├── AcademicYearService.java     🚧
│   ├── DivisionService.java         🚧
│   └── TimeSlotService.java         🚧
├── Repository/
│   ├── UserRepository.java          ✅
│   ├── DepartmentRepository.java    🚧
│   ├── TeacherRepository.java       🚧
│   ├── CourseRepository.java        🚧
│   ├── RoomRepository.java          🚧
│   ├── AcademicYearRepository.java  🚧
│   ├── DivisionRepository.java      🚧
│   └── TimeSlotRepository.java      🚧
├── Entity/
│   ├── User.java                    ✅
│   ├── Department.java              ✅ (Likely exists)
│   ├── Teacher.java                 ✅
│   ├── Course.java                  ✅
│   ├── Room.java                    ✅
│   ├── AcademicYear.java            ✅
│   ├── Division.java                ✅
│   └── TimeSlot.java                ✅
└── Security/
    ├── JwtUtil.java                 ✅
    ├── SecurityConfig.java          ✅
    └── JwtAuthenticationFilter.java ✅
```

---

## 📝 Implementation Templates

### 1. Controller Template (Example: DepartmentController)

```java
package com.College.timetable.Controller;

import com.College.timetable.Entity.Department;
import com.College.timetable.Service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/api/departments")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "http://localhost:5173")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartmentById(@PathVariable Long id) {
        return departmentService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Department> createDepartment(@RequestBody Department department) {
        return ResponseEntity.ok(departmentService.save(department));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Department> updateDepartment(
            @PathVariable Long id,
            @RequestBody Department department) {
        return departmentService.findById(id)
                .map(existing -> {
                    department.setId(id);
                    return ResponseEntity.ok(departmentService.save(department));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
        if (departmentService.findById(id).isPresent()) {
            departmentService.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
```

### 2. Service Template (Example: DepartmentService)

```java
package com.College.timetable.Service;

import com.College.timetable.Entity.Department;
import com.College.timetable.Repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    public List<Department> findAll() {
        return departmentRepository.findAll();
    }

    public Optional<Department> findById(Long id) {
        return departmentRepository.findById(id);
    }

    public Department save(Department department) {
        return departmentRepository.save(department);
    }

    public void deleteById(Long id) {
        departmentRepository.deleteById(id);
    }

    public Optional<Department> findByCode(String code) {
        return departmentRepository.findByCode(code);
    }
}
```

### 3. Repository Template (Example: DepartmentRepository)

```java
package com.College.timetable.Repository;

import com.College.timetable.Entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Optional<Department> findByCode(String code);
    Optional<Department> findByName(String name);
}
```

---

## 🔒 Security Configuration

### Ensure SecurityConfig allows admin endpoints:

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors().and()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/**").hasAnyRole("TEACHER", "ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .addFilterBefore(jwtAuthenticationFilter, 
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

---

## 🐛 Troubleshooting

### Issue: 403 Error on Refresh
**Cause:** JWT token not being sent with requests  
**Fix:** 
1. ✅ Updated auth store to restore token on page load
2. ✅ API interceptor already adds token to requests
3. Check browser localStorage has 'jwt_token'
4. Check backend JWT validation

### Issue: CORS Errors
**Cause:** Backend not allowing frontend origin  
**Fix:** Add CORS configuration (see above)

### Issue: 401 Unauthorized
**Cause:** JWT token expired or invalid  
**Fix:** 
1. Check token expiration time in backend
2. Implement token refresh mechanism
3. Clear localStorage and login again

### Issue: Endpoints Return 404
**Cause:** Controllers not implemented or wrong URL  
**Fix:** Implement missing controllers (see templates above)

---

## ✅ Quick Implementation Checklist

### For Each Entity (Department, Teacher, Course, etc.):

1. **Repository** (5 minutes)
   - [ ] Create interface extending JpaRepository
   - [ ] Add custom query methods if needed

2. **Service** (10 minutes)
   - [ ] Create service class with @Service
   - [ ] Implement CRUD methods
   - [ ] Add business logic validation

3. **Controller** (15 minutes)
   - [ ] Create controller with @RestController
   - [ ] Add @PreAuthorize for security
   - [ ] Implement GET, POST, PUT, DELETE endpoints
   - [ ] Add @CrossOrigin for CORS

4. **Testing** (10 minutes)
   - [ ] Test with Postman
   - [ ] Verify JWT token works
   - [ ] Check CORS headers
   - [ ] Test from frontend

**Total per entity: ~40 minutes**  
**Total for 7 entities: ~4-5 hours**

---

## 🚀 Priority Implementation Order

### Phase 1 (High Priority - 2 hours)
1. **DepartmentController** - Simplest, good starting point
2. **AcademicYearController** - Critical for system
3. **TeacherController** - Core functionality

### Phase 2 (Medium Priority - 2 hours)
4. **CourseController** - Needed for timetables
5. **RoomController** - Needed for timetables
6. **TimeSlotController** - Needed for timetables

### Phase 3 (Lower Priority - 1 hour)
7. **DivisionController** - Can use mock data initially

---

## 📊 Testing Endpoints

### Using Postman:

1. **Login First**
```
POST http://localhost:8083/auth/login
Body: {
  "email": "admin@mitaoe.ac.in",
  "password": "admin123"
}
Response: { "token": "eyJhbGc..." }
```

2. **Test Department Endpoint**
```
GET http://localhost:8083/admin/api/departments
Headers: {
  "Authorization": "Bearer eyJhbGc..."
}
```

3. **Create Department**
```
POST http://localhost:8083/admin/api/departments
Headers: {
  "Authorization": "Bearer eyJhbGc...",
  "Content-Type": "application/json"
}
Body: {
  "name": "Computer Science",
  "code": "CS",
  "headOfDepartment": "Dr. John Smith"
}
```

---

## 📝 Next Steps

### Immediate (Frontend - Already Done ✅)
- [x] Fix 403 error on refresh
- [x] Update API service with all endpoints
- [x] Add proper error handling

### Backend Implementation (To Do 🚧)
- [ ] Implement all 7 controller classes
- [ ] Implement all 7 service classes
- [ ] Create all 7 repository interfaces
- [ ] Test each endpoint with Postman
- [ ] Verify CORS configuration
- [ ] Test frontend integration

### Testing (To Do 🚧)
- [ ] Test all CRUD operations
- [ ] Verify JWT authentication
- [ ] Check role-based access
- [ ] Test error scenarios
- [ ] Verify data persistence

---

## 💡 Tips

1. **Start Simple**: Implement Department first, it's the simplest
2. **Copy-Paste**: Use templates above, just change entity names
3. **Test Often**: Test each endpoint before moving to next
4. **Use Postman**: Create a collection for all endpoints
5. **Check Logs**: Backend console shows helpful error messages
6. **CORS Issues**: Make sure @CrossOrigin is on all controllers
7. **JWT Issues**: Check token in browser localStorage
8. **Database**: Verify entities are being saved in MySQL

---

## 🎯 Expected Outcome

After implementing all backend endpoints:
- ✅ No more 403 errors on refresh
- ✅ Real data from database instead of mock data
- ✅ Full CRUD operations working
- ✅ Proper error messages
- ✅ Role-based access control
- ✅ Complete Phase 1 functionality

---

**Estimated Time**: 4-6 hours for complete backend implementation  
**Difficulty**: Medium (mostly repetitive work)  
**Priority**: High (needed for full functionality)

