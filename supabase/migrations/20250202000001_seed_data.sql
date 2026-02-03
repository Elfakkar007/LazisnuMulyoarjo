-- =====================================================
-- LAZISNU MULYOARJO - SEED DATA
-- =====================================================

-- =====================================================
-- 1. ORGANIZATION PROFILE
-- =====================================================
INSERT INTO organization_profile (
  vision,
  mission,
  about,
  whatsapp_number,
  email,
  address,
  logo_url
) VALUES (
  'Menjadi lembaga amil zakat yang amanah, profesional, dan transparan dalam mengelola dana umat untuk kesejahteraan masyarakat Mulyoarjo',
  E'1. Mengelola dana ZIS (Zakat, Infaq, Shadaqah) secara profesional dan transparan\n2. Memberdayakan ekonomi masyarakat melalui program-program produktif\n3. Meningkatkan kualitas pendidikan dan kesehatan masyarakat\n4. Membangun kesadaran beragama dan solidaritas sosial',
  'LazisNU Mulyoarjo adalah lembaga amil zakat di bawah naungan Nahdlatul Ulama yang fokus pada pengelolaan koin amal untuk berbagai program sosial, pendidikan, kesehatan, dan keagamaan di wilayah Desa Mulyoarjo.',
  '+6281234567890',
  'lazisnu.mulyoarjo@gmail.com',
  'Jl. Raya Mulyoarjo No. 123, Desa Mulyoarjo, Kecamatan Ampelgading, Kabupaten Malang, Jawa Timur 65183',
  '/assets/logo.ico'
);

-- =====================================================
-- 2. PROGRAM CATEGORIES
-- =====================================================
INSERT INTO program_categories (name, percentage, color_code) VALUES
('NU Care Sosial Berdaya', 40, '#10b981'),
('NU Care Cerdas', 25, '#3b82f6'),
('NU Care Damai', 15, '#8b5cf6'),
('NU Care Taktis', 20, '#f59e0b');

-- =====================================================
-- 3. FINANCIAL YEARS
-- =====================================================
INSERT INTO financial_years (year, is_active, total_income, total_expense) VALUES
(2023, false, 15200000, 12800000),
(2024, false, 18750000, 14500000),
(2025, true, 21300000, 16200000);

-- =====================================================
-- 4. STRUCTURE POSITIONS (Pengurus Inti)
-- =====================================================
INSERT INTO structure_positions (position_name, position_order, is_core) VALUES
('Ketua', 1, true),
('Wakil Ketua', 2, true),
('Sekretaris', 3, true),
('Bendahara', 4, true),
('Koordinator Program', 5, true);

-- =====================================================
-- 5. STRUCTURE POSITIONS (Koordinator Dusun)
-- =====================================================
INSERT INTO structure_positions (position_name, position_order, is_core) VALUES
('Koordinator Pakutukan', 6, false),
('Koordinator Watugel', 7, false),
('Koordinator Paras', 8, false),
('Koordinator Ampelgading', 9, false);

-- =====================================================
-- 6. STRUCTURE MEMBERS (Sample - Pengurus Inti)
-- =====================================================
DO $$
DECLARE
  ketua_id UUID;
  wakil_id UUID;
  sekretaris_id UUID;
  bendahara_id UUID;
  koordinator_id UUID;
BEGIN
  SELECT id INTO ketua_id FROM structure_positions WHERE position_name = 'Ketua';
  SELECT id INTO wakil_id FROM structure_positions WHERE position_name = 'Wakil Ketua';
  SELECT id INTO sekretaris_id FROM structure_positions WHERE position_name = 'Sekretaris';
  SELECT id INTO bendahara_id FROM structure_positions WHERE position_name = 'Bendahara';
  SELECT id INTO koordinator_id FROM structure_positions WHERE position_name = 'Koordinator Program';

  INSERT INTO structure_members (position_id, name, photo_url, member_order) VALUES
  (ketua_id, 'H. Ahmad Sholeh, S.Pd.I', NULL, 1),
  (wakil_id, 'Ustadz Muhammad Fauzi', NULL, 1),
  (sekretaris_id, 'Siti Fatimah, S.Sos', NULL, 1),
  (bendahara_id, 'Abdul Rahman, S.E', NULL, 1),
  (koordinator_id, 'Hasan Basri, S.Pd', NULL, 1);
END $$;

-- =====================================================
-- 7. STRUCTURE MEMBERS (Sample - Koordinator Dusun)
-- =====================================================
DO $$
DECLARE
  pakutukan_id UUID;
  watugel_id UUID;
  paras_id UUID;
  ampelgading_id UUID;
BEGIN
  SELECT id INTO pakutukan_id FROM structure_positions WHERE position_name = 'Koordinator Pakutukan';
  SELECT id INTO watugel_id FROM structure_positions WHERE position_name = 'Koordinator Watugel';
  SELECT id INTO paras_id FROM structure_positions WHERE position_name = 'Koordinator Paras';
  SELECT id INTO ampelgading_id FROM structure_positions WHERE position_name = 'Koordinator Ampelgading';

  -- Pakutukan
  INSERT INTO structure_members (position_id, name, dusun, member_order) VALUES
  (pakutukan_id, 'Budi Santoso', 'Pakutukan', 1),
  (pakutukan_id, 'Suryadi', 'Pakutukan', 2),
  (pakutukan_id, 'Agus Wijaya', 'Pakutukan', 3),
  (pakutukan_id, 'Hendra Kusuma', 'Pakutukan', 4),
  (pakutukan_id, 'Dedi Prasetyo', 'Pakutukan', 5);

  -- Watugel
  INSERT INTO structure_members (position_id, name, dusun, member_order) VALUES
  (watugel_id, 'Wahyu Hidayat', 'Watugel', 1),
  (watugel_id, 'Imam Syafi''i', 'Watugel', 2),
  (watugel_id, 'Rizal Ahmad', 'Watugel', 3),
  (watugel_id, 'Fajar Nugroho', 'Watugel', 4),
  (watugel_id, 'Gunawan Setiawan', 'Watugel', 5);

  -- Paras
  INSERT INTO structure_members (position_id, name, dusun, member_order) VALUES
  (paras_id, 'Bambang Susilo', 'Paras', 1),
  (paras_id, 'Dwi Cahyono', 'Paras', 2),
  (paras_id, 'Eko Purnomo', 'Paras', 3),
  (paras_id, 'Firman Saputra', 'Paras', 4),
  (paras_id, 'Galih Pratama', 'Paras', 5);

  -- Ampelgading
  INSERT INTO structure_members (position_id, name, dusun, member_order) VALUES
  (ampelgading_id, 'Yusuf Hamdani', 'Ampelgading', 1),
  (ampelgading_id, 'Zainal Abidin', 'Ampelgading', 2),
  (ampelgading_id, 'Ali Murtadho', 'Ampelgading', 3),
  (ampelgading_id, 'Bayu Saputra', 'Ampelgading', 4),
  (ampelgading_id, 'Candra Wijaya', 'Ampelgading', 5);
END $$;

-- =====================================================
-- 8. HOMEPAGE SLIDES
-- =====================================================
INSERT INTO homepage_slides (badge, title, detail, background_gradient, link_url, slide_order, is_active) VALUES
('KEGIATAN', 'Santunan Anak Yatim', '12 Okt • Masjid Al-Ikhlas, Mulyoarjo', 'from-emerald-800 via-emerald-600 to-teal-700', '/kegiatan/santunan-anak-yatim', 1, true),
('SOSIAL', 'Pembagian Sembako Rutin', '25 Okt • Balai Desa Mulyoarjo', 'from-teal-800 via-emerald-700 to-emerald-500', '/kegiatan/pembagian-sembako', 2, true),
('KESEHATAN', 'Bakti Sosial Kesehatan Desa', '3 Nov • Puskesmas Mulyoarjo', 'from-emerald-900 via-teal-700 to-emerald-600', '/kegiatan/bakti-sosial-kesehatan', 3, true);

-- =====================================================
-- 9. KALENG DISTRIBUTION (Sample untuk tahun 2025)
-- =====================================================
DO $$
DECLARE
  year_2025_id UUID;
BEGIN
  SELECT id INTO year_2025_id FROM financial_years WHERE year = 2025;

  -- Januari 2025
  INSERT INTO kaleng_distribution (year_id, month, dusun, total_distributed, total_collected, total_not_collected) VALUES
  (year_2025_id, 1, 'Pakutukan', 250, 230, 20),
  (year_2025_id, 1, 'Watugel', 300, 280, 20),
  (year_2025_id, 1, 'Paras', 350, 320, 30),
  (year_2025_id, 1, 'Ampelgading', 350, 325, 25);

  -- Februari 2025
  INSERT INTO kaleng_distribution (year_id, month, dusun, total_distributed, total_collected, total_not_collected) VALUES
  (year_2025_id, 2, 'Pakutukan', 250, 235, 15),
  (year_2025_id, 2, 'Watugel', 300, 285, 15),
  (year_2025_id, 2, 'Paras', 350, 330, 20),
  (year_2025_id, 2, 'Ampelgading', 350, 330, 20);

  -- Maret - November (pattern serupa)
  FOR m IN 3..11 LOOP
    INSERT INTO kaleng_distribution (year_id, month, dusun, total_distributed, total_collected, total_not_collected) VALUES
    (year_2025_id, m, 'Pakutukan', 250, 230 + (m % 10), 20 - (m % 10)),
    (year_2025_id, m, 'Watugel', 300, 280 + (m % 10), 20 - (m % 10)),
    (year_2025_id, m, 'Paras', 350, 320 + (m % 15), 30 - (m % 15)),
    (year_2025_id, m, 'Ampelgading', 350, 325 + (m % 15), 25 - (m % 15));
  END LOOP;
END $$;

-- =====================================================
-- 10. MONTHLY INCOME (Sample untuk tahun 2025)
-- =====================================================
DO $$
DECLARE
  year_2025_id UUID;
BEGIN
  SELECT id INTO year_2025_id FROM financial_years WHERE year = 2025;

  INSERT INTO monthly_income (year_id, month, gross_amount, kaleng_wages, spb_cost) VALUES
  (year_2025_id, 1, 2500000, 200000, 100000),
  (year_2025_id, 2, 2300000, 200000, 100000),
  (year_2025_id, 3, 2600000, 200000, 100000),
  (year_2025_id, 4, 2450000, 200000, 100000),
  (year_2025_id, 5, 2700000, 200000, 100000),
  (year_2025_id, 6, 2550000, 200000, 100000),
  (year_2025_id, 7, 2800000, 200000, 100000),
  (year_2025_id, 8, 2650000, 200000, 100000),
  (year_2025_id, 9, 2900000, 200000, 100000),
  (year_2025_id, 10, 2750000, 200000, 100000),
  (year_2025_id, 11, 3000000, 200000, 100000);
  -- Desember belum ada data
END $$;

-- =====================================================
-- 11. PROGRAMS (Sample untuk tahun 2025)
-- =====================================================
DO $$
DECLARE
  year_2025_id UUID;
  sosial_id UUID;
  cerdas_id UUID;
  damai_id UUID;
  taktis_id UUID;
BEGIN
  SELECT id INTO year_2025_id FROM financial_years WHERE year = 2025;
  SELECT id INTO sosial_id FROM program_categories WHERE name = 'NU Care Sosial Berdaya';
  SELECT id INTO cerdas_id FROM program_categories WHERE name = 'NU Care Cerdas';
  SELECT id INTO damai_id FROM program_categories WHERE name = 'NU Care Damai';
  SELECT id INTO taktis_id FROM program_categories WHERE name = 'NU Care Taktis';

  -- NU Care Sosial Berdaya (40%)
  INSERT INTO programs (year_id, category_id, name, description, target_audience, quantity, budget, realization, is_completed) VALUES
  (year_2025_id, sosial_id, 'Bantuan Orang Meninggal', 'Santunan kematian untuk warga yang meninggal', 'Keluarga yang berduka', '15 kasus', 6000000, 5500000, true),
  (year_2025_id, sosial_id, 'Bantuan Orang Sakit', 'Bantuan biaya pengobatan untuk warga sakit', 'Warga kurang mampu yang sakit', '25 orang', 5000000, 4200000, true),
  (year_2025_id, sosial_id, 'Santunan Anak Yatim', 'Santunan rutin untuk anak yatim', 'Anak yatim di 4 dusun', '50 anak', 8000000, 8000000, true),
  (year_2025_id, sosial_id, 'Bantuan Musibah Kebakaran', 'Bantuan untuk korban kebakaran', 'Korban musibah', 'Kondisional', 3000000, 0, false);

  -- NU Care Cerdas (25%)
  INSERT INTO programs (year_id, category_id, name, description, target_audience, quantity, budget, realization, is_completed) VALUES
  (year_2025_id, cerdas_id, 'Beasiswa Pendidikan', 'Beasiswa untuk siswa berprestasi kurang mampu', 'Siswa SD-SMA', '30 siswa', 9000000, 9000000, true),
  (year_2025_id, cerdas_id, 'Bantuan Seragam Sekolah', 'Bantuan seragam untuk siswa tidak mampu', 'Siswa SD', '40 siswa', 4000000, 4000000, true),
  (year_2025_id, cerdas_id, 'Pelatihan Keterampilan', 'Pelatihan keterampilan untuk pemuda', 'Pemuda putus sekolah', '20 orang', 5000000, 3500000, true);

  -- NU Care Damai (15%)
  INSERT INTO programs (year_id, category_id, name, description, target_audience, quantity, budget, realization, is_completed) VALUES
  (year_2025_id, damai_id, 'Pengajian Rutin Bulanan', 'Pengajian rutin setiap bulan', 'Masyarakat umum', '12 kali', 6000000, 5500000, true),
  (year_2025_id, damai_id, 'Peringatan Hari Besar Islam', 'Maulid, Isra Mi''raj, dll', 'Masyarakat umum', '5 acara', 4000000, 3800000, true),
  (year_2025_id, damai_id, 'Bantuan Tempat Ibadah', 'Renovasi dan pemeliharaan masjid', 'Masjid/Musholla', '3 tempat', 5000000, 2000000, false);

  -- NU Care Taktis (20%)
  INSERT INTO programs (year_id, category_id, name, description, target_audience, quantity, budget, realization, is_completed) VALUES
  (year_2025_id, taktis_id, 'Operasional Kantor', 'Biaya operasional kantor LazisNU', 'Internal', '12 bulan', 8000000, 7500000, true),
  (year_2025_id, taktis_id, 'Honor Pengurus', 'Honor untuk pengurus aktif', 'Pengurus', '5 orang x 12 bulan', 6000000, 6000000, true),
  (year_2025_id, taktis_id, 'ATK dan Administrasi', 'Alat tulis dan kebutuhan administrasi', 'Internal', 'Rutin', 3000000, 2500000, true);
END $$;

-- =====================================================
-- 12. ACTIVITY ARTICLES (Sample)
-- =====================================================
INSERT INTO activity_articles (title, slug, category, excerpt, content, activity_date, location, is_published, published_at) VALUES
(
  'Santunan Anak Yatim Januari 2025',
  'santunan-anak-yatim-januari-2025',
  'Sosial',
  'LazisNU Mulyoarjo memberikan santunan kepada 50 anak yatim di wilayah Desa Mulyoarjo sebagai bentuk kepedulian terhadap kesejahteraan anak.',
  E'<p>Pada tanggal 20 Januari 2025, LazisNU Mulyoarjo mengadakan program santunan anak yatim yang dihadiri oleh 50 anak yatim dari 4 dusun di wilayah Desa Mulyoarjo.</p>\n\n<p>Kegiatan yang berlangsung di Masjid Al-Ikhlas ini dihadiri oleh pengurus LazisNU, tokoh masyarakat, dan para orang tua/wali dari anak-anak yatim.</p>\n\n<p>Setiap anak mendapatkan santunan berupa uang tunai sebesar Rp 150.000 dan paket sembako yang berisi beras, minyak goreng, dan kebutuhan pokok lainnya.</p>\n\n<p>"Ini adalah bentuk komitmen kami untuk terus memperhatikan kesejahteraan anak-anak yatim di Desa Mulyoarjo. Semoga santunan ini dapat sedikit membantu kebutuhan mereka," ujar H. Ahmad Sholeh, Ketua LazisNU Mulyoarjo.</p>',
  '2025-01-20',
  'Masjid Al-Ikhlas, Mulyoarjo',
  true,
  '2025-01-21 10:00:00'
),
(
  'Pembagian Sembako untuk Warga Kurang Mampu',
  'pembagian-sembako-warga-kurang-mampu',
  'Sosial',
  'Sebanyak 80 paket sembako dibagikan kepada warga kurang mampu di 4 dusun sebagai program rutin LazisNU Mulyoarjo.',
  E'<p>LazisNU Mulyoarjo kembali menggelar program pembagian sembako untuk warga kurang mampu pada tanggal 25 Oktober 2024 di Balai Desa Mulyoarjo.</p>\n\n<p>Sebanyak 80 paket sembako yang berisi beras 5kg, minyak goreng 2 liter, gula 1kg, dan telur 1kg dibagikan kepada warga yang membutuhkan.</p>\n\n<p>Pembagian dilakukan secara merata di 4 dusun yaitu Pakutukan, Watugel, Paras, dan Ampelgading dengan masing-masing dusun mendapatkan 20 paket.</p>\n\n<p>"Alhamdulillah program ini bisa berjalan rutin setiap bulan berkat partisipasi masyarakat dalam program koin amal. Mari kita terus bersedekah untuk sesama," ajak Ustadz Muhammad Fauzi, Wakil Ketua LazisNU.</p>',
  '2024-10-25',
  'Balai Desa Mulyoarjo',
  true,
  '2024-10-26 08:00:00'
),
(
  'Bakti Sosial Kesehatan Gratis',
  'bakti-sosial-kesehatan-gratis',
  'Kesehatan',
  'LazisNU bekerja sama dengan Puskesmas mengadakan bakti sosial kesehatan gratis untuk warga dengan pemeriksaan dan obat gratis.',
  E'<p>Dalam rangka meningkatkan derajat kesehatan masyarakat, LazisNU Mulyoarjo bekerja sama dengan Puskesmas Ampelgading mengadakan bakti sosial kesehatan gratis pada 3 November 2024.</p>\n\n<p>Kegiatan yang berlangsung di halaman Puskesmas ini menyediakan berbagai layanan kesehatan gratis meliputi pemeriksaan tekanan darah, gula darah, kolesterol, serta konsultasi kesehatan dengan dokter.</p>\n\n<p>Sebanyak 150 warga mengikuti pemeriksaan kesehatan gratis ini. Mereka yang membutuhkan juga mendapatkan obat-obatan gratis sesuai dengan hasil pemeriksaan.</p>\n\n<p>"Program ini sangat membantu masyarakat yang kesulitan akses layanan kesehatan. Terima kasih kepada LazisNU dan Puskesmas yang telah menyelenggarakan kegiatan ini," ungkap salah satu peserta, Ibu Siti (58).</p>',
  '2024-11-03',
  'Puskesmas Ampelgading',
  true,
  '2024-11-04 14:00:00'
),
(
  'Pengajian Rutin Bulanan Ramadhan',
  'pengajian-rutin-bulanan-ramadhan',
  'Keagamaan',
  'Pengajian rutin bulan Ramadhan dengan tema "Meraih Berkah di Bulan Penuh Ampunan" dihadiri ratusan jamaah.',
  E'<p>LazisNU Mulyoarjo mengadakan pengajian rutin bulanan dengan tema khusus menyambut bulan suci Ramadhan pada tanggal 15 Maret 2024 di Masjid Al-Ikhlas.</p>\n\n<p>Acara yang menghadirkan Ustadz KH. Abdul Malik sebagai pemateri ini dihadiri oleh lebih dari 300 jamaah dari berbagai kalangan.</p>\n\n<p>Dalam ceramahnya, beliau menyampaikan tentang pentingnya memaksimalkan ibadah di bulan Ramadhan dan berbagi kepada sesama sebagai wujud syukur.</p>\n\n<p>"Bulan Ramadhan adalah bulan penuh berkah. Mari kita maksimalkan dengan ibadah dan berbagi kepada yang membutuhkan. Koin amal yang kita sisihkan setiap hari akan menjadi ladang pahala yang tak terputus," ujar KH. Abdul Malik.</p>\n\n<p>Acara ditutup dengan doa bersama untuk kesejahteraan umat dan kemudahan dalam beribadah di bulan Ramadhan.</p>',
  '2024-03-15',
  'Masjid Al-Ikhlas, Mulyoarjo',
  true,
  '2024-03-16 09:00:00'
),
(
  'Beasiswa Pendidikan untuk Siswa Berprestasi',
  'beasiswa-pendidikan-siswa-berprestasi',
  'Sosial',
  'LazisNU Mulyoarjo menyalurkan beasiswa pendidikan kepada 30 siswa berprestasi dari keluarga kurang mampu.',
  E'<p>Sebagai bentuk komitmen dalam bidang pendidikan, LazisNU Mulyoarjo menyalurkan beasiswa pendidikan kepada 30 siswa berprestasi dari keluarga kurang mampu pada 10 Januari 2025.</p>\n\n<p>Beasiswa diberikan kepada siswa SD, SMP, dan SMA dengan nominal berbeda sesuai jenjang pendidikan. Siswa SD mendapat Rp 500.000, SMP Rp 750.000, dan SMA Rp 1.000.000 per tahun.</p>\n\n<p>Para penerima beasiswa dipilih berdasarkan prestasi akademik dan kondisi ekonomi keluarga yang diverifikasi oleh tim LazisNU bersama pihak sekolah.</p>\n\n<p>"Pendidikan adalah investasi masa depan. Kami berharap beasiswa ini dapat meringankan beban orang tua dan memotivasi anak-anak untuk terus berprestasi," kata Abdul Rahman, Bendahara LazisNU.</p>\n\n<p>Acara penyerahan beasiswa dihadiri oleh kepala desa, kepala sekolah, dan para orang tua siswa penerima beasiswa.</p>',
  '2025-01-10',
  'Balai Desa Mulyoarjo',
  true,
  '2025-01-11 11:00:00'
);

-- =====================================================
-- 13. ADMIN ACCOUNT (Password: admin123)
-- Note: Untuk production, gunakan Supabase Auth
-- Ini hanya untuk development/testing
-- =====================================================
-- Password hash untuk "admin123" menggunakan bcrypt
-- Anda perlu generate hash ini menggunakan bcrypt library
-- Contoh: $2a$10$... (hash sebenarnya akan panjang)

INSERT INTO admins (email, password_hash, name) VALUES
('admin@lazisnu-mulyoarjo.org', '$2a$10$YourBcryptHashHere', 'Administrator');

-- Note: Untuk password hash yang sebenarnya, Anda perlu:
-- 1. Install bcrypt di environment Anda
-- 2. Generate hash dengan: bcrypt.hash('admin123', 10)
-- 3. Replace $2a$10$YourBcryptHashHere dengan hash yang dihasilkan
