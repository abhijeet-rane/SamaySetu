package com.College.timetable.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.College.timetable.Entity.Batch;
import com.College.timetable.Entity.Division;
import com.College.timetable.Repository.Batch_repo;
import com.College.timetable.Repository.Division_repo;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/admin/api/batches")
@PreAuthorize("hasRole('ADMIN')")
public class BatchController {

    @Autowired
    private Batch_repo batchRepository;

    @Autowired
    private Division_repo divisionRepository;

    @GetMapping
    public ResponseEntity<List<Batch>> getAll() {
        return ResponseEntity.ok(batchRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Batch> getById(@PathVariable Long id) {
        Batch batch = batchRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Batch not found"));
        return ResponseEntity.ok(batch);
    }

    @GetMapping("/division/{divisionId}")
    public ResponseEntity<List<Batch>> getByDivision(@PathVariable Long divisionId) {
        return ResponseEntity.ok(batchRepository.findByDivisionId(divisionId));
    }

    @PostMapping
    public ResponseEntity<Batch> create(@Valid @RequestBody Batch batch) {
        if (batch.getDivision() != null && batch.getDivision().getId() != null) {
            Division division = divisionRepository.findById(batch.getDivision().getId())
                .orElseThrow(() -> new EntityNotFoundException("Division not found"));
            batch.setDivision(division);
        }
        return ResponseEntity.ok(batchRepository.save(batch));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Batch> update(@PathVariable Long id, @Valid @RequestBody Batch batch) {
        Batch existing = batchRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Batch not found"));
        
        existing.setName(batch.getName());
        
        if (batch.getDivision() != null && batch.getDivision().getId() != null) {
            Division division = divisionRepository.findById(batch.getDivision().getId())
                .orElseThrow(() -> new EntityNotFoundException("Division not found"));
            existing.setDivision(division);
        }
        
        return ResponseEntity.ok(batchRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!batchRepository.existsById(id)) {
            throw new EntityNotFoundException("Batch not found");
        }
        batchRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
