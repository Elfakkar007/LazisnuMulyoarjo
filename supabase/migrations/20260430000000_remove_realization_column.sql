-- ==============================================================================
-- MIGRATION: REMOVE REALIZATION COLUMN FROM PROGRAMS
-- Description:
-- Menghapus kolom realization dari tabel programs karena realisasi dihitung
-- secara dinamis berdasarkan data dari tabel financial_transactions.
-- ==============================================================================

BEGIN;

ALTER TABLE programs DROP COLUMN IF EXISTS realization;

COMMIT;

-- ==============================================================================
-- MIGRATION COMPLETED
-- ==============================================================================
