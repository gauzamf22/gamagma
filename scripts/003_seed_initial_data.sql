-- Seed contact persons
INSERT INTO public.contact_persons (name, role, whatsapp, location, photo_url) VALUES
('Muhammad Rizky', 'Gugus PIONIR', '+628123456789', 'Yogyakarta', 'https://api.dicebear.com/7.x/avataaars/svg?seed=rizky'),
('Siti Nurhaliza', 'Co-Fasilitator', '+628234567890', 'Sleman', 'https://api.dicebear.com/7.x/avataaars/svg?seed=siti'),
('Ahmad Fadhil', 'Gugus PIONIR', '+628345678901', 'Bantul', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmad'),
('Dewi Kartika', 'Co-Fasilitator', '+628456789012', 'Yogyakarta', 'https://api.dicebear.com/7.x/avataaars/svg?seed=dewi')
ON CONFLICT DO NOTHING;

-- Seed UGM faculties
INSERT INTO public.faculties (name, code, description, website_url, image_url) VALUES
('Fakultas Kedokteran, Kesehatan Masyarakat, dan Keperawatan', 'FK-KMK', 'Fakultas kesehatan terkemuka dengan berbagai program studi di bidang medis dan kesehatan', 'https://fk.ugm.ac.id', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600'),
('Fakultas Teknik', 'FT', 'Fakultas teknik dengan berbagai jurusan seperti Teknik Sipil, Mesin, Elektro, Kimia, dan lainnya', 'https://ft.ugm.ac.id', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600'),
('Fakultas Ekonomika dan Bisnis', 'FEB', 'Fakultas ekonomi dan bisnis yang melahirkan entrepreneur dan pemimpin bisnis masa depan', 'https://feb.ugm.ac.id', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600'),
('Fakultas Ilmu Sosial dan Ilmu Politik', 'FISIPOL', 'Fakultas yang fokus pada ilmu sosial, politik, komunikasi, dan hubungan internasional', 'https://fisipol.ugm.ac.id', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600'),
('Fakultas Ilmu Budaya', 'FIB', 'Fakultas yang mengkaji berbagai aspek budaya, bahasa, dan sastra', 'https://fib.ugm.ac.id', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600'),
('Fakultas Matematika dan Ilmu Pengetahuan Alam', 'FMIPA', 'Fakultas sains dengan berbagai program studi di bidang matematika dan ilmu pengetahuan alam', 'https://mipa.ugm.ac.id', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600'),
('Fakultas Pertanian', 'FAPERTA', 'Fakultas pertanian yang fokus pada pengembangan pertanian berkelanjutan', 'https://faperta.ugm.ac.id', 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600'),
('Fakultas Peternakan', 'FAPET', 'Fakultas yang mengembangkan ilmu peternakan dan kesejahteraan hewan', 'https://fapet.ugm.ac.id', 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=600'),
('Fakultas Kehutanan', 'FAHUTAN', 'Fakultas yang fokus pada konservasi hutan dan lingkungan', 'https://fahutan.ugm.ac.id', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600'),
('Fakultas Teknologi Pertanian', 'FTP', 'Fakultas yang mengembangkan teknologi pengolahan hasil pertanian', 'https://ftp.ugm.ac.id', 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=600'),
('Fakultas Geografi', 'GEOGRAFI', 'Fakultas yang mempelajari fenomena geografi dan lingkungan', 'https://geo.ugm.ac.id', 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=600'),
('Fakultas Biologi', 'BIOLOGI', 'Fakultas yang fokus pada studi kehidupan dan organisme', 'https://biology.ugm.ac.id', 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&h=600'),
('Fakultas Farmasi', 'FARMASI', 'Fakultas yang mengembangkan ilmu kefarmasian dan obat-obatan', 'https://farmasi.ugm.ac.id', 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=600'),
('Fakultas Psikologi', 'PSIKOLOGI', 'Fakultas yang mempelajari perilaku dan proses mental manusia', 'https://psikologi.ugm.ac.id', 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=800&h=600'),
('Fakultas Hukum', 'FH', 'Fakultas hukum terkemuka di Indonesia', 'https://law.ugm.ac.id', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600'),
('Sekolah Vokasi', 'SV', 'Pendidikan vokasi dengan berbagai program diploma', 'https://vokasi.ugm.ac.id', 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=600')
ON CONFLICT (code) DO NOTHING;

-- Seed sample quiz questions
INSERT INTO public.quiz_questions (question, options, correct_answer, explanation, category, difficulty) VALUES
('Kapan Universitas Gadjah Mada didirikan?', 
 '[{"text": "19 Desember 1949", "value": "A"}, {"text": "17 Agustus 1945", "value": "B"}, {"text": "10 November 1945", "value": "C"}, {"text": "2 Mei 1950", "value": "D"}]'::jsonb,
 'A',
 'UGM didirikan pada tanggal 19 Desember 1949 oleh Pemerintah Republik Indonesia',
 'UGM History',
 'easy'),
 
('Siapa pendiri Universitas Gadjah Mada?', 
 '[{"text": "Soekarno", "value": "A"}, {"text": "Mohammad Hatta", "value": "B"}, {"text": "Pemerintah RI", "value": "C"}, {"text": "Ki Hajar Dewantara", "value": "D"}]'::jsonb,
 'C',
 'UGM didirikan oleh Pemerintah Republik Indonesia sebagai universitas nasional pertama',
 'UGM History',
 'easy'),
 
('Berapa jumlah fakultas di UGM saat ini?', 
 '[{"text": "16", "value": "A"}, {"text": "18", "value": "B"}, {"text": "20", "value": "C"}, {"text": "15", "value": "D"}]'::jsonb,
 'B',
 'UGM memiliki 18 fakultas termasuk Sekolah Vokasi dan Sekolah Pascasarjana',
 'Academics',
 'medium'),
 
('Apa motto Universitas Gadjah Mada?', 
 '[{"text": "Mengabdi pada Bangsa", "value": "A"}, {"text": "Locally Rooted, Globally Respected", "value": "B"}, {"text": "Pancasila dan UUD 1945", "value": "C"}, {"text": "Ilmu untuk Rakyat", "value": "D"}]'::jsonb,
 'B',
 'Motto UGM adalah "Locally Rooted, Globally Respected" yang mencerminkan karakter universitas yang berakar pada nilai lokal namun dihormati secara global',
 'UGM History',
 'medium'),
 
('Di mana lokasi kampus utama UGM?', 
 '[{"text": "Bulaksumur, Yogyakarta", "value": "A"}, {"text": "Malioboro, Yogyakarta", "value": "B"}, {"text": "Kaliurang, Sleman", "value": "C"}, {"text": "Wirobrajan, Yogyakarta", "value": "D"}]'::jsonb,
 'A',
 'Kampus utama UGM terletak di Bulaksumur, Yogyakarta dengan luas area sekitar 360 hektar',
 'Campus Life',
 'easy')
ON CONFLICT DO NOTHING;

-- Seed sample track records
INSERT INTO public.track_records (student_name, year, program, faculty, major, photo_url, achievements) VALUES
('Ahmad Fadli Ramadhan', '2024', 'SNBP', 'Fakultas Kedokteran', 'Pendidikan Dokter', 'https://api.dicebear.com/7.x/avataaars/svg?seed=fadli', ARRAY['Juara 1 Olimpiade Biologi Nasional', 'Aktif di organisasi PMR']),
('Siti Aisyah Putri', '2024', 'SNBT', 'Fakultas Teknik', 'Teknik Elektro', 'https://api.dicebear.com/7.x/avataaars/svg?seed=aisyah', ARRAY['Juara 2 Lomba Karya Ilmiah Remaja', 'Ketua OSIS MAN 2 Kota Malang']),
('Muhammad Rizki Pratama', '2023', 'SNBP', 'Fakultas Ekonomika dan Bisnis', 'Manajemen', 'https://api.dicebear.com/7.x/avataaars/svg?seed=rizki', ARRAY['Finalis Business Plan Competition', 'Aktif di UKM Wirausaha']),
('Dewi Fortuna Sari', '2023', 'Mandiri', 'Fakultas Ilmu Sosial dan Ilmu Politik', 'Ilmu Komunikasi', 'https://api.dicebear.com/7.x/avataaars/svg?seed=fortuna', ARRAY['Juara 1 Lomba Debat Bahasa Inggris', 'Editor Majalah Sekolah']),
('Fajar Ramadhan', '2022', 'SNBP', 'Fakultas Psikologi', 'Psikologi', 'https://api.dicebear.com/7.x/avataaars/svg?seed=fajar', ARRAY['Aktif di BEM', 'Volunteer di berbagai kegiatan sosial'])
ON CONFLICT DO NOTHING;
