-- Add position_role column to structure_members table
ALTER TABLE structure_members 
ADD COLUMN IF NOT EXISTS "position_role" text;

-- Add comment
COMMENT ON COLUMN structure_members.position_role IS 'Role of the member (e.g. Koordinator, Anggota) mainly for non-core positions';
