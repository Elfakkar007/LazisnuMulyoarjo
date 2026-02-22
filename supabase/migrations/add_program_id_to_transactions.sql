-- ==============================================================================
-- MIGRATION: ADD PROGRAM_ID TO FINANCIAL_TRANSACTIONS
-- Description:
-- Menambahkan kolom program_id ke tabel financial_transactions untuk menghubungkan
-- pengeluaran secara langsung dengan program kerja.
-- ==============================================================================

BEGIN;

-- 1. Add column program_id (Nullable)
ALTER TABLE financial_transactions
ADD COLUMN program_id UUID REFERENCES programs(id) ON DELETE SET NULL;

-- 2. Add Index for performance
CREATE INDEX idx_transactions_program ON financial_transactions(program_id);

-- 3. Comment for documentation
COMMENT ON COLUMN financial_transactions.program_id IS 'Link ke tabel programs untuk tracking realisasi anggaran otomatis';

COMMIT;

-- ==============================================================================
-- MIGRATION COMPLETED
-- ==============================================================================
