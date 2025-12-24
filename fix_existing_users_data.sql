-- Quick fix for existing users with null values
-- Run this script to fix the immediate login issue

-- Update existing users with null is_first_login to FALSE
UPDATE teachers 
SET is_first_login = FALSE 
WHERE is_first_login IS NULL;

-- Update existing users with null weekly hours
UPDATE teachers 
SET min_weekly_hours = 10 
WHERE min_weekly_hours IS NULL;

UPDATE teachers 
SET max_weekly_hours = 30 
WHERE max_weekly_hours IS NULL;

-- Verify the updates
SELECT id, name, email, is_first_login, min_weekly_hours, max_weekly_hours 
FROM teachers 
WHERE is_first_login IS NULL OR min_weekly_hours IS NULL OR max_weekly_hours IS NULL;