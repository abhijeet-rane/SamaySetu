package com.College.timetable.Controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.College.timetable.Entity.CourseEntity;
import com.College.timetable.Entity.CourseType;
import com.College.timetable.Entity.DepartmentEntity;
import com.College.timetable.Entity.Semester;
import com.College.timetable.Entity.TeacherEntity;
import com.College.timetable.IO.AdminStaffUpdateRequest;
import com.College.timetable.IO.ManualStaffRequest;
import com.College.timetable.Repository.Dep_repo;
import com.College.timetable.Service.AdminService;
import com.College.timetable.Service.CourseService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    @Autowired
    private AdminService adminService;
    
    @Autowired
    private CourseService courseService;
    
    @Autowired
    private Dep_repo departmentRepository;
    
    @PostMapping("/upload-staff")
    public ResponseEntity<String> uploadStaffCSV(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Please select a CSV file to upload");
            }
            
            if (!file.getOriginalFilename().toLowerCase().endsWith(".csv")) {
                return ResponseEntity.badRequest().body("Please upload a CSV file");
            }
            
            List<TeacherEntity> staffList = parseCSV(file);
            int created = adminService.createStaffFromCSV(staffList);
            
            return ResponseEntity.ok("Successfully created " + created + " staff members");
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing CSV: " + e.getMessage());
        }
    }
    
    @PostMapping("/create-staff")
    public ResponseEntity<String> createStaffManually(@Valid @RequestBody ManualStaffRequest request) {
        try {
            TeacherEntity teacher = new TeacherEntity();
            teacher.setName(request.getName());
            teacher.setEmployeeId(request.getEmployeeId());
            teacher.setEmail(request.getEmail());
            teacher.setPhone(request.getPhone());
            teacher.setSpecialization(request.getSpecialization());
            teacher.setMinWeeklyHours(request.getMinWeeklyHours());
            teacher.setMaxWeeklyHours(request.getMaxWeeklyHours());
            
            // Set defaults for admin-created staff
            teacher.setPassword("mitaoe@123");
            teacher.setRole("TEACHER");
            teacher.setIsActive(true);
            teacher.setIsApproved(true);
            teacher.setIsEmailVerified(true);
            teacher.setIsFirstLogin(true);
            
            List<TeacherEntity> staffList = new ArrayList<>();
            staffList.add(teacher);
            
            int created = adminService.createStaffFromCSV(staffList);
            
            if (created > 0) {
                return ResponseEntity.ok("Staff member created successfully");
            } else {
                return ResponseEntity.badRequest().body("Staff member already exists with this email or employee ID");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating staff: " + e.getMessage());
        }
    }
    
    @GetMapping("/download-staff-template")
    public ResponseEntity<String> downloadStaffTemplate() {
        String csvContent = "Name,Employee ID,Email,Phone,Specialization,Min Weekly Hours,Max Weekly Hours\n" +
                           "John Doe,EMP001,john.doe@mitaoe.ac.in,9876543210,Computer Science,12,25\n" +
                           "Jane Smith,EMP002,jane.smith@mitaoe.ac.in,9876543211,Mathematics,10,20\n" +
                           "Robert Johnson,EMP003,robert.johnson@mitaoe.ac.in,9876543212,Physics,15,30\n" +
                           "Emily Davis,EMP004,emily.davis@mitaoe.ac.in,9876543213,Chemistry,10,25";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "staff_template.csv");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(csvContent);
    }
    
    @PutMapping("/update-staff/{id}")
    public ResponseEntity<TeacherEntity> updateStaff(@PathVariable Long id, @Valid @RequestBody AdminStaffUpdateRequest request) {
        try {
            TeacherEntity updated = adminService.updateStaff(id, request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/upload-courses")
    public ResponseEntity<String> uploadCoursesCSV(
            @RequestParam("file") MultipartFile file,
            @RequestParam("departmentId") Long departmentId,
            @RequestParam("year") Integer year) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Please select a CSV file to upload");
            }
            
            if (!file.getOriginalFilename().toLowerCase().endsWith(".csv")) {
                return ResponseEntity.badRequest().body("Please upload a CSV file");
            }
            
            DepartmentEntity department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));
            
            List<CourseEntity> courseList = parseCoursesCSV(file, department, year);
            int created = 0;
            
            for (CourseEntity course : courseList) {
                try {
                    courseService.add(course);
                    created++;
                } catch (Exception e) {
                    System.err.println("Error creating course " + course.getCode() + ": " + e.getMessage());
                }
            }
            
            return ResponseEntity.ok("Successfully created " + created + " courses");
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing CSV: " + e.getMessage());
        }
    }
    
    @GetMapping("/download-courses-template")
    public ResponseEntity<String> downloadCoursesTemplate() {
        String csvContent = "Name,Code,Type,Credits,Hours Per Week,Semester\n" +
                           "Data Structures,CS201,THEORY,3,4,1\n" +
                           "Data Structures Lab,CS201L,LAB,1,2,1\n" +
                           "Database Management,CS301,THEORY,4,4,3\n" +
                           "Operating Systems,CS302,THEORY,3,3,4";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "courses_template.csv");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(csvContent);
    }
    
    private List<CourseEntity> parseCoursesCSV(MultipartFile file, DepartmentEntity department, Integer year) throws Exception {
        List<CourseEntity> courseList = new ArrayList<>();
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean isFirstLine = true;
            int lineNumber = 1;
            
            while ((line = reader.readLine()) != null) {
                lineNumber++;
                if (isFirstLine) {
                    isFirstLine = false;
                    continue;
                }
                
                String[] fields = line.split(",");
                if (fields.length < 6) {
                    throw new RuntimeException("Line " + lineNumber + ": Invalid CSV format. Expected at least 6 columns (Name,Code,Type,Credits,Hours Per Week,Semester)");
                }
                
                CourseEntity course = new CourseEntity();
                course.setName(fields[0].trim());
                course.setCode(fields[1].trim());
                
                // Parse course type
                String typeStr = fields[2].trim().toUpperCase();
                try {
                    course.setCourseType(CourseType.valueOf(typeStr));
                } catch (IllegalArgumentException e) {
                    throw new RuntimeException("Line " + lineNumber + ": Invalid course type '" + typeStr + "'. Use THEORY, LAB, or TUTORIAL");
                }
                
                // Parse credits
                try {
                    course.setCredits(Integer.parseInt(fields[3].trim()));
                } catch (NumberFormatException e) {
                    throw new RuntimeException("Line " + lineNumber + ": Invalid credits value '" + fields[3].trim() + "'");
                }
                
                // Parse hours per week
                try {
                    course.setHoursPerWeek(Integer.parseInt(fields[4].trim()));
                } catch (NumberFormatException e) {
                    throw new RuntimeException("Line " + lineNumber + ": Invalid hours per week value '" + fields[4].trim() + "'");
                }
                
                // Parse semester (1-8)
                try {
                    int semNum = Integer.parseInt(fields[5].trim());
                    if (semNum < 1 || semNum > 8) {
                        throw new RuntimeException("Line " + lineNumber + ": Semester must be between 1 and 8");
                    }
                    course.setSemester(Semester.valueOf("SEM_" + semNum));
                } catch (NumberFormatException e) {
                    throw new RuntimeException("Line " + lineNumber + ": Invalid semester value '" + fields[5].trim() + "'. Use 1-8");
                }
                
                course.setDepartment(department);
                course.setYear(year);
                course.setIsActive(true);
                
                courseList.add(course);
            }
        }
        
        return courseList;
    }
    
    private List<TeacherEntity> parseCSV(MultipartFile file) throws Exception {
        List<TeacherEntity> staffList = new ArrayList<>();
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean isFirstLine = true;
            
            while ((line = reader.readLine()) != null) {
                // Skip header row
                if (isFirstLine) {
                    isFirstLine = false;
                    continue;
                }
                
                String[] fields = line.split(",");
                if (fields.length < 7) {
                    throw new RuntimeException("Invalid CSV format. Expected at least 7 columns");
                }
                
                TeacherEntity teacher = new TeacherEntity();
                teacher.setName(fields[0].trim());
                teacher.setEmployeeId(fields[1].trim());
                teacher.setEmail(fields[2].trim());
                teacher.setPhone(fields[3].trim());
                teacher.setSpecialization(fields[4].trim());
                teacher.setMinWeeklyHours(Integer.parseInt(fields[5].trim()));
                teacher.setMaxWeeklyHours(Integer.parseInt(fields[6].trim()));
                
                // Set defaults
                teacher.setPassword("mitaoe@123"); // Will be encoded by service
                teacher.setRole("TEACHER");
                teacher.setIsActive(true);
                teacher.setIsApproved(true);
                teacher.setIsEmailVerified(true);
                teacher.setIsFirstLogin(true);
                
                staffList.add(teacher);
            }
        }
        
        return staffList;
    }
}