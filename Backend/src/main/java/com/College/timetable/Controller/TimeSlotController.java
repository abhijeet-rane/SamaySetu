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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.College.timetable.Entity.TimeSlot;
import com.College.timetable.Service.TimeSlotService;

import jakarta.validation.Valid;

@RestController
public class TimeSlotController {
	
	@Autowired
	private TimeSlotService timeSlotService;
	
	// Public endpoint for teachers to view time slots
	@GetMapping("/api/time-slots")
	public ResponseEntity<List<TimeSlot>> getTimeSlots() {
		return ResponseEntity.ok(timeSlotService.getAll());
	}
	
	// Admin endpoints
	@PostMapping("/admin/api/time-slots")
	public ResponseEntity<?> addTimeSlot(@Valid @RequestBody TimeSlot timeSlot) {
		try {
			TimeSlot saved = timeSlotService.add(timeSlot);
			return ResponseEntity.ok(saved);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@GetMapping("/admin/api/time-slots")
	public ResponseEntity<List<TimeSlot>> getAllTimeSlots() {
		return ResponseEntity.ok(timeSlotService.getAll());
	}
	
	@GetMapping("/admin/api/time-slots/{id}")
	public ResponseEntity<TimeSlot> getTimeSlotById(@PathVariable Long id) {
		return ResponseEntity.ok(timeSlotService.getById(id));
	}
	
	@GetMapping("/admin/api/time-slots/type/{type}")
	public ResponseEntity<List<TimeSlot>> getTimeSlotsByType(@PathVariable String type) {
		return ResponseEntity.ok(timeSlotService.getByType(type));
	}
	
	@PutMapping("/admin/api/time-slots/{id}")
	public ResponseEntity<?> updateTimeSlot(@PathVariable Long id, @Valid @RequestBody TimeSlot timeSlot) {
		try {
			TimeSlot updated = timeSlotService.update(id, timeSlot);
			return ResponseEntity.ok(updated);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@DeleteMapping("/admin/api/time-slots/{id}")
	public ResponseEntity<String> deleteTimeSlot(@PathVariable Long id) {
		timeSlotService.delete(id);
		return ResponseEntity.ok("Time slot deleted successfully");
	}
}
