package com.College.timetable.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.College.timetable.Entity.DepartmentEntity;
import com.College.timetable.Entity.TeacherEntity;
import com.College.timetable.IO.AdminStaffUpdateRequest;
import com.College.timetable.Repository.Dep_repo;
import com.College.timetable.Repository.Teacher_Repo;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AdminService {
    
    @Autowired
    private Teacher_Repo teacherRepository;
    
    @Autowired
    private Dep_repo departmentRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public int createStaffFromCSV(List<TeacherEntity> staffList) {
        int created = 0;
        
        for (TeacherEntity teacher : staffList) {
            try {
                // Check if employee already exists
                if (teacherRepository.findByEmployeeId(teacher.getEmployeeId()).isPresent()) {
                    continue; // Skip existing employees
                }
                
                if (teacherRepository.findByEmail(teacher.getEmail()).isPresent()) {
                    continue; // Skip existing emails
                }
                
                // Encode the default password
                teacher.setPassword(passwordEncoder.encode(teacher.getPassword()));
                
                // Save the teacher
                teacherRepository.save(teacher);
                created++;
                
            } catch (Exception e) {
                // Log error but continue with other records
                System.err.println("Error creating staff member " + teacher.getEmployeeId() + ": " + e.getMessage());
            }
        }
        
        return created;
    }
    
    public TeacherEntity updateStaff(Long id, AdminStaffUpdateRequest request) {
        TeacherEntity existing = teacherRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Staff not found"));
        
        existing.setName(request.getName());
        existing.setEmployeeId(request.getEmployeeId());
        existing.setEmail(request.getEmail());
        existing.setPhone(request.getPhone());
        existing.setSpecialization(request.getSpecialization());
        existing.setMinWeeklyHours(request.getMinWeeklyHours());
        existing.setMaxWeeklyHours(request.getMaxWeeklyHours());
        
        if (request.getIsActive() != null) {
            existing.setIsActive(request.getIsActive());
        }
        
        // Update department if provided
        if (request.getDepartmentId() != null) {
            DepartmentEntity dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new EntityNotFoundException("Department not found"));
            existing.setDepartment(dept);
        } else {
            existing.setDepartment(null);
        }
        
        return teacherRepository.save(existing);
    }
}