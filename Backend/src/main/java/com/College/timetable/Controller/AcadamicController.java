package com.College.timetable.Controller;

import java.util.List;

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

import com.College.timetable.Entity.AcademicYear;
import com.College.timetable.Service.AcadamicService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("admin/api/academic-years")
public class AcadamicController {
	
	@Autowired
	private AcadamicService academicService;
	
	@PostMapping
	public ResponseEntity<AcademicYear> addAcademicYear(@Valid @RequestBody AcademicYear aca) {
		AcademicYear saved = academicService.addAcadamic(aca);
		return ResponseEntity.ok(saved);
	}
	
	@GetMapping
	public ResponseEntity<List<AcademicYear>> getAllAcademicYears() {
		return ResponseEntity.ok(academicService.getAll());
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<AcademicYear> getAcademicYearById(@PathVariable Long id) {
		return ResponseEntity.ok(academicService.getById(id));
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<AcademicYear> updateAcademicYear(@PathVariable Long id, @Valid @RequestBody AcademicYear aca) {
		AcademicYear updated = academicService.update(id, aca);
		return ResponseEntity.ok(updated);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteAcademicYear(@PathVariable Long id) {
		academicService.delete(id);
		return ResponseEntity.ok("Academic year deleted successfully");
	}
}
