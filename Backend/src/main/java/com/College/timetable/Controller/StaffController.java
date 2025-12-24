package com.College.timetable.Controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.College.timetable.Entity.TeacherEntity;
import com.College.timetable.IO.ChangePasswordRequest;
import com.College.timetable.IO.StaffProfileUpdateRequest;
import com.College.timetable.Service.TeacherService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/staff")
@PreAuthorize("hasRole('TEACHER')")
public class StaffController {
    
    @Autowired
    private TeacherService teacherService;
    
    @GetMapping("/profile")
    public ResponseEntity<TeacherEntity> getProfile(Principal principal) {
        try {
            TeacherEntity teacher = teacherService.getByEmail(principal.getName());
            return ResponseEntity.ok(teacher);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/profile")
    public ResponseEntity<TeacherEntity> updateProfile(
            @Valid @RequestBody StaffProfileUpdateRequest request, 
            Principal principal) {
        try {
            TeacherEntity updated = teacherService.updateStaffProfile(principal.getName(), request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Principal principal) {
        try {
            // Validate password confirmation
            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                return ResponseEntity.badRequest().body("New passwords do not match");
            }
            
            teacherService.changePassword(
                principal.getName(), 
                request.getCurrentPassword(), 
                request.getNewPassword()
            );
            
            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}