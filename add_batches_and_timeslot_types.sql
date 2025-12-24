-- Database changes for Academic Structure and Time Slot Types
-- Run this script to update your database schema
-- Note: Run each statement separately if you get errors (some columns may already exist)

-- 1. Create Batches Table (if not exists)
CREATE TABLE IF NOT EXISTS batches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    division_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE CASCADE
);

-- 2. Add 'type' column to time_slots table
ALTER TABLE time_slots ADD COLUMN type VARCHAR(20) DEFAULT 'TYPE_1';

-- 3. Add 'time_slot_type' column to divisions table
ALTER TABLE divisions ADD COLUMN time_slot_type VARCHAR(20) DEFAULT 'TYPE_1';

-- 4. Add 'years' column to departments table (comma-separated years: "1,2,3,4")
ALTER TABLE departments ADD COLUMN years VARCHAR(20) DEFAULT '1,2,3,4';

-- 5. Add 'year' column to courses table (1=FY, 2=SY, 3=TY, 4=BTech)
ALTER TABLE courses ADD COLUMN year INT;

-- 6. Add 'class_teacher' column to divisions table
ALTER TABLE divisions ADD COLUMN class_teacher VARCHAR(100);

-- 7. Add 'class_representative' column to divisions table
ALTER TABLE divisions ADD COLUMN class_representative VARCHAR(100);

-- 8. Add 'academic_year_id' column to departments table (for academic year specific departments)
ALTER TABLE departments ADD COLUMN academic_year_id BIGINT;
ALTER TABLE departments ADD CONSTRAINT fk_dept_academic_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id);

-- 9. Remove unique constraint on department code (if exists) - departments can have same code in different academic years
-- First find the constraint name by running: SHOW INDEX FROM departments WHERE Column_name = 'code';
-- Then drop it. Common constraint names:
ALTER TABLE departments DROP INDEX code;
-- OR if the above fails, try:
-- ALTER TABLE departments DROP INDEX uk_departments_code;
-- ALTER TABLE departments DROP INDEX departments_code_unique;

-- 9b. Remove unique constraint on department name (if exists) - departments can have same name in different academic years
-- First find the constraint name by running: SHOW INDEX FROM departments WHERE Column_name = 'name';
ALTER TABLE departments DROP INDEX name;
-- OR if the above fails, try:
-- ALTER TABLE departments DROP INDEX uk_departments_name;

-- 10. Add composite unique constraint for code + academic_year_id
ALTER TABLE departments ADD CONSTRAINT uk_dept_code_academic_year UNIQUE (code, academic_year_id);

-- 10b. Add composite unique constraint for name + academic_year_id
ALTER TABLE departments ADD CONSTRAINT uk_dept_name_academic_year UNIQUE (name, academic_year_id);

-- 11. Update existing time slots to have TYPE_1 as default
UPDATE time_slots SET type = 'TYPE_1' WHERE type IS NULL;

-- 12. Update existing divisions to have TYPE_1 as default
UPDATE divisions SET time_slot_type = 'TYPE_1' WHERE time_slot_type IS NULL;

-- 13. Update existing departments to have all years as default
UPDATE departments SET years = '1,2,3,4' WHERE years IS NULL;

-- Note: If you get "Duplicate column name" error, it means the column already exists - that's fine, skip that statement.
-- Note: If you get "Can't DROP 'code'; check that column/key exists" error, the unique constraint may have a different name.
