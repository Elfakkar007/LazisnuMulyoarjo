-- Migration: Add position_role column to structure_members table
-- This column is used to differentiate between "Koordinator" and "Anggota" in dusun structure

-- Add the position_role column
ALTER TABLE structure_members 
ADD COLUMN IF NOT EXISTS position_role VARCHAR(50) DEFAULT 'Koordinator';

-- Add a comment to the column
COMMENT ON COLUMN structure_members.position_role IS 'Role of the member in dusun (e.g., Koordinator, Anggota)';

-- Update existing records to have default value
UPDATE structure_members 
SET position_role = 'Koordinator' 
WHERE position_role IS NULL AND dusun IS NOT NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_structure_members_position_role 
ON structure_members(position_role);
