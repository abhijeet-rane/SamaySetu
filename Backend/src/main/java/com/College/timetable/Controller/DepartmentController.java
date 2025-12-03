package com.College.timetable.Controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.College.timetable.Entity.DepartmentEntity;
import com.College.timetable.Service.DepartmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("admin/api/departments")
public class DepartmentController {
	
	private static final Logger log = LoggerFactory.getLogger(DepartmentController.class);
	
	@Autowired
	private DepartmentService departmentService;
	
	@PostMapping
	public ResponseEntity<DepartmentEntity> addDepartment(@Valid @RequestBody DepartmentEntity dep) {
		log.info("Adding new department: {}", dep.getName());
		DepartmentEntity saved = departmentService.addDep(dep);
		return ResponseEntity.ok(saved);
	}
	
	@GetMapping
	public ResponseEntity<List<DepartmentEntity>> getAllDepartments() {
		log.info("Fetching all departments");
		return ResponseEntity.ok(departmentService.getall());
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<DepartmentEntity> getDepartmentById(@PathVariable Long id) {
		log.info("Fetching department with id: {}", id);
		return ResponseEntity.ok(departmentService.getById(id));
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<DepartmentEntity> updateDepartment(@PathVariable Long id, @Valid @RequestBody DepartmentEntity dep) {
		log.info("Updating department with id: {}", id);
		DepartmentEntity updated = departmentService.update(id, dep);
		return ResponseEntity.ok(updated);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteDepartment(@PathVariable Long id) {
		log.info("Deleting department with id: {}", id);
		departmentService.delete(id);
		return ResponseEntity.ok("Department deleted successfully");
	}
}
