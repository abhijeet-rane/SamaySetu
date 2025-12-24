package com.College.timetable.IO;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StaffProfileUpdateRequest {
    
    @Size(max = 15)
    private String phone;
    
    private String specialization;
}