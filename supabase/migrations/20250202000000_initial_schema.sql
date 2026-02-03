-- =====================================================
-- LAZISNU MULYOARJO - DATABASE SCHEMA
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. ADMINS TABLE
-- =====================================================
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 2. ORGANIZATION PROFILE TABLE
-- =====================================================
CREATE TABLE organization_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vision TEXT NOT NULL,
  mission TEXT NOT NULL,
  about TEXT,
  whatsapp_number VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  logo_url VARCHAR(255),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 3. STRUCTURE POSITIONS TABLE
-- =====================================================
CREATE TABLE structure_positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  position_name VARCHAR(100) NOT NULL,
  position_order INT NOT NULL,
  is_core BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 4. STRUCTURE MEMBERS TABLE
-- =====================================================
CREATE TABLE structure_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  position_id UUID REFERENCES structure_positions(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  photo_url VARCHAR(255),
  dusun VARCHAR(50),
  member_order INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 5. FINANCIAL YEARS TABLE
-- =====================================================
CREATE TABLE financial_years (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year INT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  total_income DECIMAL(15,2) DEFAULT 0,
  total_expense DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 6. KALENG DISTRIBUTION TABLE
-- =====================================================
CREATE TABLE kaleng_distribution (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year_id UUID REFERENCES financial_years(id) ON DELETE CASCADE,
  month INT NOT NULL CHECK (month >= 1 AND month <= 12),
  dusun VARCHAR(50) NOT NULL,
  total_distributed INT DEFAULT 0,
  total_collected INT DEFAULT 0,
  total_not_collected INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(year_id, month, dusun)
);

-- =====================================================
-- 7. MONTHLY INCOME TABLE
-- =====================================================
CREATE TABLE monthly_income (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year_id UUID REFERENCES financial_years(id) ON DELETE CASCADE,
  month INT NOT NULL CHECK (month >= 1 AND month <= 12),
  gross_amount DECIMAL(15,2) NOT NULL,
  kaleng_wages DECIMAL(15,2) DEFAULT 0,
  spb_cost DECIMAL(15,2) DEFAULT 0,
  jpzis_25_percent DECIMAL(15,2) DEFAULT 0,
  jpzis_75_percent DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(year_id, month)
);

-- =====================================================
-- 8. PROGRAM CATEGORIES TABLE
-- =====================================================
CREATE TABLE program_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  percentage INT NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  color_code VARCHAR(7),
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 9. PROGRAMS TABLE
-- =====================================================
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year_id UUID REFERENCES financial_years(id) ON DELETE CASCADE,
  category_id UUID REFERENCES program_categories(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  target_audience VARCHAR(200),
  quantity VARCHAR(100),
  budget DECIMAL(15,2) NOT NULL,
  realization DECIMAL(15,2) DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 10. FINANCIAL TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE financial_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year_id UUID REFERENCES financial_years(id) ON DELETE CASCADE,
  category_id UUID REFERENCES program_categories(id),
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('income', 'expense')),
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index untuk performa query
CREATE INDEX idx_transactions_year ON financial_transactions(year_id);
CREATE INDEX idx_transactions_type ON financial_transactions(transaction_type);
CREATE INDEX idx_transactions_date ON financial_transactions(transaction_date);

-- =====================================================
-- 11. TRANSACTION TEMPLATES TABLE (for dynamic builder)
-- =====================================================
CREATE TABLE transaction_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES program_categories(id) ON DELETE CASCADE,
  template_name VARCHAR(100) NOT NULL,
  columns JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 12. TRANSACTION ROWS TABLE (for dynamic builder)
-- =====================================================
CREATE TABLE transaction_rows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year_id UUID REFERENCES financial_years(id) ON DELETE CASCADE,
  category_id UUID REFERENCES program_categories(id) ON DELETE CASCADE,
  row_order INT NOT NULL,
  row_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 13. ACTIVITY ARTICLES TABLE
-- =====================================================
CREATE TABLE activity_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Sosial', 'Kesehatan', 'Keagamaan')),
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url VARCHAR(255),
  activity_date DATE NOT NULL,
  location VARCHAR(200),
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index untuk performa query
CREATE INDEX idx_articles_published ON activity_articles(is_published, published_at DESC);
CREATE INDEX idx_articles_category ON activity_articles(category);
CREATE INDEX idx_articles_slug ON activity_articles(slug);

-- =====================================================
-- 14. ACTIVITY IMAGES TABLE
-- =====================================================
CREATE TABLE activity_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES activity_articles(id) ON DELETE CASCADE,
  image_url VARCHAR(255) NOT NULL,
  caption TEXT,
  image_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 15. HOMEPAGE SLIDES TABLE
-- =====================================================
CREATE TABLE homepage_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  badge VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  detail VARCHAR(200),
  background_gradient VARCHAR(100),
  link_url VARCHAR(255),
  slide_order INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for admins
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for organization_profile
CREATE TRIGGER update_organization_profile_updated_at BEFORE UPDATE ON organization_profile
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for activity_articles
CREATE TRIGGER update_activity_articles_updated_at BEFORE UPDATE ON activity_articles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-calculate monthly income percentages
CREATE OR REPLACE FUNCTION calculate_monthly_income_percentages()
RETURNS TRIGGER AS $$
DECLARE
    nett_amount DECIMAL(15,2);
BEGIN
    -- Calculate nett amount
    nett_amount := NEW.gross_amount - NEW.kaleng_wages - NEW.spb_cost;
    
    -- Calculate 25% and 75%
    NEW.jpzis_25_percent := nett_amount * 0.25;
    NEW.jpzis_75_percent := nett_amount * 0.75;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for monthly_income
CREATE TRIGGER calculate_percentages_before_insert_update 
BEFORE INSERT OR UPDATE ON monthly_income
FOR EACH ROW EXECUTE FUNCTION calculate_monthly_income_percentages();

-- Function to ensure only one active financial year
CREATE OR REPLACE FUNCTION ensure_single_active_year()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_active = TRUE THEN
        UPDATE financial_years SET is_active = FALSE WHERE id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for financial_years
CREATE TRIGGER ensure_one_active_year 
BEFORE INSERT OR UPDATE ON financial_years
FOR EACH ROW EXECUTE FUNCTION ensure_single_active_year();

-- Function to auto-set published_at when article is published
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_published = TRUE AND OLD.is_published = FALSE THEN
        NEW.published_at := NOW();
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for activity_articles
CREATE TRIGGER set_article_published_at 
BEFORE UPDATE ON activity_articles
FOR EACH ROW EXECUTE FUNCTION set_published_at();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE structure_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE structure_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE kaleng_distribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_income ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_slides ENABLE ROW LEVEL SECURITY;

-- Public READ access for public pages
CREATE POLICY "Public can view organization profile" ON organization_profile
FOR SELECT USING (true);

CREATE POLICY "Public can view structure positions" ON structure_positions
FOR SELECT USING (true);

CREATE POLICY "Public can view structure members" ON structure_members
FOR SELECT USING (true);

CREATE POLICY "Public can view active financial years" ON financial_years
FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view kaleng distribution" ON kaleng_distribution
FOR SELECT USING (true);

CREATE POLICY "Public can view monthly income" ON monthly_income
FOR SELECT USING (true);

CREATE POLICY "Public can view program categories" ON program_categories
FOR SELECT USING (true);

CREATE POLICY "Public can view programs" ON programs
FOR SELECT USING (true);

CREATE POLICY "Public can view financial transactions" ON financial_transactions
FOR SELECT USING (true);

CREATE POLICY "Public can view published articles" ON activity_articles
FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view article images" ON activity_images
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM activity_articles 
    WHERE activity_articles.id = activity_images.article_id 
    AND activity_articles.is_published = true
  )
);

CREATE POLICY "Public can view active homepage slides" ON homepage_slides
FOR SELECT USING (is_active = true);

-- Admin FULL access (will be controlled by auth.uid() later)
-- For now, we'll create policies that allow authenticated users full access
-- You'll need to configure Supabase Auth and update these policies accordingly

CREATE POLICY "Authenticated users can manage admins" ON admins
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage organization profile" ON organization_profile
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage structure positions" ON structure_positions
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage structure members" ON structure_members
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage financial years" ON financial_years
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage kaleng distribution" ON kaleng_distribution
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage monthly income" ON monthly_income
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage program categories" ON program_categories
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage programs" ON programs
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage financial transactions" ON financial_transactions
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage transaction templates" ON transaction_templates
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage transaction rows" ON transaction_rows
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage articles" ON activity_articles
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage article images" ON activity_images
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage homepage slides" ON homepage_slides
FOR ALL USING (auth.role() = 'authenticated');
