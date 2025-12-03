package com.College.timetable.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.College.timetable.Entity.AcademicYear;
import com.College.timetable.Repository.Acadamic_repo;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AcadamicService {
	
	@Autowired
	private Acadamic_repo acadamy;

	public AcademicYear addAcadamic(AcademicYear aca) {
		return acadamy.save(aca);
	}
	
	public List<AcademicYear> getAll() {
		return acadamy.findAll();
	}
	
	public AcademicYear getById(Long id) {
		return acadamy.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Academic year not found with id: " + id));
	}
	
	public AcademicYear update(Long id, AcademicYear aca) {
		AcademicYear existing = getById(id);
		existing.setYearName(aca.getYearName());
		existing.setStartDate(aca.getStartDate());
		existing.setEndDate(aca.getEndDate());
		existing.setIsCurrent(aca.getIsCurrent());
		return acadamy.save(existing);
	}
	
	public void delete(Long id) {
		if (!acadamy.existsById(id)) {
			throw new EntityNotFoundException("Academic year not found with id: " + id);
		}
		acadamy.deleteById(id);
	}
}
