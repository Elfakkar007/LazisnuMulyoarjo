// =====================================================
// GENERAL INFO SECTION - FINAL FIXED VERSION
// File: components/admin/profile/general-info-section.tsx
// =====================================================

'use client';

import { useState } from 'react';
import { Building2, Save } from 'lucide-react';
import { ImageUpload } from '@/components/admin/articles/image-upload';
import { RichTextEditor } from '@/components/admin/articles/rich-text-editor';

interface OrganizationProfile {
    id: string;
    vision: string;
    mission: string;
    about: string | null;
    whatsapp_number: string | null;
    email: string | null;
    address: string | null;
    logo_url: string | null;
    google_maps_url: string | null;
    updated_at: string;
    // Note: social_media_links tidak digunakan di section ini
}

interface GeneralInfoSectionProps {
    profile: OrganizationProfile;
    onSave: (data: Partial<OrganizationProfile>) => Promise<void>;
    saving: boolean;
}

export function GeneralInfoSection({ profile, onSave, saving }: GeneralInfoSectionProps) {
    const [formData, setFormData] = useState({
        logo_url: profile.logo_url,
        about: profile.about || '',
        vision: profile.vision,
        mission: profile.mission,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Logo Organisasi
                </label>
                <div className="max-w-xs">
                    <ImageUpload
                        value={formData.logo_url}
                        onChange={(url) => setFormData({ ...formData, logo_url: url })}
                        label=""
                        aspectRatio="1:1"
                        maxSizeMB={1}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    Rekomendasi: Square (1:1), maksimal 1MB
                </p>
            </div>

            {/* About */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tentang Organisasi
                </label>
                <RichTextEditor
                    content={formData.about}
                    onChange={(html) => setFormData({ ...formData, about: html })}
                    placeholder="Tulis tentang organisasi..."
                />
                <p className="text-xs text-gray-500 mt-2">
                    Deskripsi lengkap tentang LazisNU Mulyoarjo
                </p>
            </div>

            {/* Vision */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Visi *
                </label>
                <textarea
                    value={formData.vision}
                    onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    rows={4}
                    required
                    placeholder="Masukkan visi organisasi..."
                />
            </div>

            {/* Mission */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Misi *
                </label>
                <textarea
                    value={formData.mission}
                    onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    rows={8}
                    required
                    placeholder="Masukkan misi organisasi (satu poin per baris)..."
                />
                <p className="text-xs text-gray-500 mt-2">
                    Gunakan baris baru untuk setiap poin misi
                </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                    <Save className="w-5 h-5" />
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>
        </form>
    );
}
