package com.College.timetable.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.College.timetable.Entity.DepartmentEntity;
import com.College.timetable.Repository.Dep_repo;

import jakarta.persistence.EntityNotFoundException;

@Service
public class DepartmentService {
	
	@Autowired
	private Dep_repo dep;
	
	public DepartmentEntity addDep(DepartmentEntity d) {
		return dep.save(d);
	}
	
	public List<DepartmentEntity> getall() {
		return dep.findAll();
	}
	
	public DepartmentEntity getById(Long id) {
		return dep.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Department not found with id: " + id));
	}
	
	public DepartmentEntity update(Long id, DepartmentEntity d) {
		DepartmentEntity existing = getById(id);
		existing.setName(d.getName());
		existing.setCode(d.getCode());
		existing.setHeadOfDepartment(d.getHeadOfDepartment());
		return dep.save(existing);
	}
	
	public void delete(Long id) {
		if (!dep.existsById(id)) {
			throw new EntityNotFoundException("Department not found with id: " + id);
		}
		dep.deleteById(id);
	}
}
