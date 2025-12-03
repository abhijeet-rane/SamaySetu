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

import com.College.timetable.Entity.TimeSlot;
import com.College.timetable.Service.TimeSlotService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("admin/api/time-slots")
public class TimeSlotController {
	
	@Autowired
	private TimeSlotService timeSlotService;
	
	@PostMapping
	public ResponseEntity<TimeSlot> addTimeSlot(@Valid @RequestBody TimeSlot timeSlot) {
		TimeSlot saved = timeSlotService.add(timeSlot);
		return ResponseEntity.ok(saved);
	}
	
	@GetMapping
	public ResponseEntity<List<TimeSlot>> getAllTimeSlots() {
		return ResponseEntity.ok(timeSlotService.getAll());
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<TimeSlot> getTimeSlotById(@PathVariable Long id) {
		return ResponseEntity.ok(timeSlotService.getById(id));
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<TimeSlot> updateTimeSlot(@PathVariable Long id, @Valid @RequestBody TimeSlot timeSlot) {
		TimeSlot updated = timeSlotService.update(id, timeSlot);
		return ResponseEntity.ok(updated);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteTimeSlot(@PathVariable Long id) {
		timeSlotService.delete(id);
		return ResponseEntity.ok("Time slot deleted successfully");
	}
}
