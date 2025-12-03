package com.College.timetable.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.College.timetable.Entity.AcademicYear;
import com.College.timetable.Entity.DepartmentEntity;
import com.College.timetable.Entity.Division;
import com.College.timetable.Repository.Acadamic_repo;
import com.College.timetable.Repository.Dep_repo;
import com.College.timetable.Repository.Division_repo;

import jakarta.persistence.EntityNotFoundException;

@Service
public class DivisionService {
	
	@Autowired
	private Division_repo div;
	
	@Autowired
	private Acadamic_repo aca;
	
	@Autowired
	private Dep_repo dep;
	
	public Division addDivision(Division division) {
		// Validate academic year exists
		if (division.getAcademicYear() != null && division.getAcademicYear().getId() != null) {
			AcademicYear a = aca.findById(division.getAcademicYear().getId())
				.orElseThrow(() -> new EntityNotFoundException("Academic year not found"));
		}
		
		// Validate department exists
		if (division.getDepartment() != null && division.getDepartment().getId() != null) {
			DepartmentEntity d = dep.findById(division.getDepartment().getId())
				.orElseThrow(() -> new EntityNotFoundException("Department not found"));
		}
		
		return div.save(division);
	}
	
	public List<Division> getAll() {
		return div.findAll();
	}
	
	public Division getById(Long id) {
		return div.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Division not found with id: " + id));
	}
	
	public Division update(Long id, Division division) {
		Division existing = getById(id);
		existing.setName(division.getName());
		existing.setYear(division.getYear());
		existing.setBranch(division.getBranch());
		existing.setTotalStudents(division.getTotalStudents());
		existing.setIsActive(division.getIsActive());
		
		// Update academic year if provided
		if (division.getAcademicYear() != null && division.getAcademicYear().getId() != null) {
			AcademicYear a = aca.findById(division.getAcademicYear().getId())
				.orElseThrow(() -> new EntityNotFoundException("Academic year not found"));
			existing.setAcademicYear(a);
		}
		
		// Update department if provided
		if (division.getDepartment() != null && division.getDepartment().getId() != null) {
			DepartmentEntity d = dep.findById(division.getDepartment().getId())
				.orElseThrow(() -> new EntityNotFoundException("Department not found"));
			existing.setDepartment(d);
		}
		
		return div.save(existing);
	}
	
	public void delete(Long id) {
		if (!div.existsById(id)) {
			throw new EntityNotFoundException("Division not found with id: " + id);
		}
		div.deleteById(id);
	}
}
