package com.College.timetable.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;

import com.College.timetable.Entity.TimetableEntry;
import com.College.timetable.Repository.TimetableEntry_repo;

@Service
@Transactional(readOnly = true)
public class TimetableService {

    @Autowired
    private TimetableEntry_repo timetableRepo;

    @Cacheable(value = "timetable-division", key = "{#divisionId, #academicYearId}")
    public List<TimetableEntry> getTimetableForDivision(Long divisionId, Long academicYearId) {
        return timetableRepo.findByDivisionIdAndAcademicYearId(divisionId, academicYearId);
    }

    @Cacheable(value = "timetable-teacher", key = "{#teacherId, #academicYearId}")
    public List<TimetableEntry> getTimetableForTeacher(Long teacherId, Long academicYearId) {
        return timetableRepo.findByTeacherIdAndAcademicYearId(teacherId, academicYearId);
    }
}
