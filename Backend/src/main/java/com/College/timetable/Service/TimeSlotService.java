package com.College.timetable.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.College.timetable.Entity.TimeSlot;
import com.College.timetable.Repository.TimeSlot_repo;

import jakarta.persistence.EntityNotFoundException;

@Service
public class TimeSlotService {
	
	@Autowired
	private TimeSlot_repo timeSlotRepo;
	
	public TimeSlot add(TimeSlot timeSlot) {
		return timeSlotRepo.save(timeSlot);
	}
	
	public List<TimeSlot> getAll() {
		return timeSlotRepo.findAll();
	}
	
	public TimeSlot getById(Long id) {
		return timeSlotRepo.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Time slot not found with id: " + id));
	}
	
	public TimeSlot update(Long id, TimeSlot timeSlot) {
		TimeSlot existing = getById(id);
		existing.setStartTime(timeSlot.getStartTime());
		existing.setEndTime(timeSlot.getEndTime());
		existing.setDurationMinutes(timeSlot.getDurationMinutes());
		existing.setSlotName(timeSlot.getSlotName());
		existing.setIsBreak(timeSlot.getIsBreak());
		existing.setIsActive(timeSlot.getIsActive());
		return timeSlotRepo.save(existing);
	}
	
	public void delete(Long id) {
		if (!timeSlotRepo.existsById(id)) {
			throw new EntityNotFoundException("Time slot not found with id: " + id);
		}
		timeSlotRepo.deleteById(id);
	}
}
