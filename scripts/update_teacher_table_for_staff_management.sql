-- Update teacher table for staff management system
-- Add new columns for min/max weekly hours and first login tracking

-- Add new columns
ALTER TABLE teachers 
ADD COLUMN min_weekly_hours INTEGER DEFAULT 10,
ADD COLUMN max_weekly_hours INTEGER DEFAULT 30,
ADD COLUMN is_first_login BOOLEAN DEFAULT TRUE;

-- Update existing records to have reasonable defaults
-- Set is_first_login to FALSE for existing users (they've already logged in)
UPDATE teachers 
SET min_weekly_hours = COALESCE(min_weekly_hours, 10), 
    max_weekly_hours = COALESCE(max_weekly_hours, 30), 
    is_first_login = COALESCE(is_first_login, FALSE)
WHERE min_weekly_hours IS NULL OR max_weekly_hours IS NULL OR is_first_login IS NULL;

-- Remove the old weekly_hours_limit column (optional - you may want to keep it for backward compatibility)
-- ALTER TABLE teachers DROP COLUMN weekly_hours_limit;

-- Add constraints
ALTER TABLE teachers 
ADD CONSTRAINT chk_min_weekly_hours CHECK (min_weekly_hours >= 1 AND min_weekly_hours <= 40),
ADD CONSTRAINT chk_max_weekly_hours CHECK (max_weekly_hours >= 1 AND max_weekly_hours <= 50),
ADD CONSTRAINT chk_weekly_hours_range CHECK (max_weekly_hours >= min_weekly_hours);

-- Make sure the columns are NOT NULL after setting defaults
ALTER TABLE teachers 
ALTER COLUMN min_weekly_hours SET NOT NULL,
ALTER COLUMN max_weekly_hours SET NOT NULL,
ALTER COLUMN is_first_login SET NOT NULL;

-- Create index for better performance on employee_id lookups
CREATE INDEX IF NOT EXISTS idx_teachers_employee_id ON teachers(employee_id);
CREATE INDEX IF NOT EXISTS idx_teachers_is_first_login ON teachers(is_first_login);

-- Sample CSV format for staff upload:
-- Name,Employee ID,Email,Phone,Specialization,Min Weekly Hours,Max Weekly Hours
-- "John Doe","EMP001","john.doe@mitaoe.ac.in","9876543210","Computer Science",12,25
-- "Jane Smith","EMP002","jane.smith@mitaoe.ac.in","9876543211","Mathematics",10,20