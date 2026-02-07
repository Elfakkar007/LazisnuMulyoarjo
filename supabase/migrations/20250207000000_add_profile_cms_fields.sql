-- =====================================================
-- MIGRATION: Add Profile CMS Fields
-- Date: 2025-02-07
-- =====================================================

-- Add new columns to organization_profile
ALTER TABLE organization_profile 
ADD COLUMN IF NOT EXISTS google_maps_url VARCHAR(500);

-- Add new columns to structure_positions
ALTER TABLE structure_positions 
ADD COLUMN IF NOT EXISTS tenure_period VARCHAR(50);

-- Add new columns to structure_members
ALTER TABLE structure_members 
ADD COLUMN IF NOT EXISTS bio VARCHAR(200),
ADD COLUMN IF NOT EXISTS motto VARCHAR(200),
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;

-- Create index for social_links JSONB queries
CREATE INDEX IF NOT EXISTS idx_structure_members_social_links 
ON structure_members USING gin(social_links);

-- Update RLS policies to allow authenticated users to manage all profile data
-- (Already covered in initial migration, but ensuring it's comprehensive)

-- Insert default dusun positions if they don't exist
DO $$
DECLARE
  position_exists BOOLEAN;
BEGIN
  -- Check if dusun positions exist
  SELECT EXISTS (
    SELECT 1 FROM structure_positions WHERE is_core = FALSE
  ) INTO position_exists;

  -- If no dusun positions, create them
  IF NOT position_exists THEN
    INSERT INTO structure_positions (position_name, position_order, is_core, tenure_period)
    VALUES 
      ('Koordinator Pakutukan', 100, FALSE, NULL),
      ('Koordinator Watugel', 101, FALSE, NULL),
      ('Koordinator Paras', 102, FALSE, NULL),
      ('Koordinator Ampelgading', 103, FALSE, NULL);
  END IF;
END $$;

-- Comments for documentation
COMMENT ON COLUMN organization_profile.google_maps_url IS 'URL to Google Maps location';
COMMENT ON COLUMN structure_positions.tenure_period IS 'Period of service, e.g., "2024-2029"';
COMMENT ON COLUMN structure_members.bio IS 'Short biography, max 200 characters';
COMMENT ON COLUMN structure_members.motto IS 'Personal motto or life principle';
COMMENT ON COLUMN structure_members.social_links IS 'JSON object containing social media links (instagram, facebook, linkedin)';
