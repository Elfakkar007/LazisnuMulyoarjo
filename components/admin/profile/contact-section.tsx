'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Save, ExternalLink, Instagram, Music, Facebook, Youtube, Twitter } from 'lucide-react';

interface SocialMediaLinks {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    youtube?: string;
    twitter?: string;
}

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
    social_media_links: SocialMediaLinks | null;
    updated_at: string;
}

interface ContactSectionProps {
    profile: OrganizationProfile;
    onSave: (data: Partial<OrganizationProfile>) => Promise<void>;
    saving: boolean;
}

export function ContactSection({ profile, onSave, saving }: ContactSectionProps) {
    const [formData, setFormData] = useState({
        whatsapp_number: profile.whatsapp_number || '',
        email: profile.email || '',
        address: profile.address || '',
        google_maps_url: profile.google_maps_url || '',
    });

    const [socialMedia, setSocialMedia] = useState<SocialMediaLinks>(
        profile.social_media_links || {}
    );

    const formatPhoneNumber = (value: string) => {
        // Remove all non-digits
        const cleaned = value.replace(/\D/g, '');

        // Format to Indonesian number
        if (cleaned.startsWith('0')) {
            return `+62${cleaned.substring(1)}`;
        } else if (cleaned.startsWith('62')) {
            return `+${cleaned}`;
        } else if (cleaned.startsWith('+62')) {
            return cleaned;
        }

        return value;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData({ ...formData, whatsapp_number: value });
    };

    const handlePhoneBlur = () => {
        if (formData.whatsapp_number) {
            const formatted = formatPhoneNumber(formData.whatsapp_number);
            setFormData({ ...formData, whatsapp_number: formatted });
        }
    };

    const handleSocialMediaChange = (platform: keyof SocialMediaLinks, value: string) => {
        setSocialMedia({ ...socialMedia, [platform]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave({
            ...formData,
            social_media_links: socialMedia,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information Section */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-emerald-600" />
                    Informasi Kontak
                </h3>
                
                <div className="space-y-6">
                    {/* WhatsApp */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nomor WhatsApp
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="tel"
                                value={formData.whatsapp_number}
                                onChange={handlePhoneChange}
                                onBlur={handlePhoneBlur}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="08123456789 atau +6281234567890"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Format akan otomatis disesuaikan ke +62xxx
                        </p>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="lazisnu@mulyoarjo.org"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Alamat Lengkap
                        </label>
                        <div className="relative">
                            <div className="absolute top-3 left-3 pointer-events-none">
                                <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                rows={4}
                                placeholder="Jl. Raya Mulyoarjo No. 123, Kecamatan..."
                            />
                        </div>
                    </div>

                    {/* Google Maps URL */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Link Google Maps (Opsional)
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <ExternalLink className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="url"
                                value={formData.google_maps_url}
                                onChange={(e) => setFormData({ ...formData, google_maps_url: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="https://maps.google.com/..."
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Salin link dari Google Maps untuk memudahkan pengunjung menemukan lokasi
                        </p>
                    </div>

                    {/* Preview Google Maps */}
                    {formData.google_maps_url && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm font-semibold text-blue-900 mb-2">
                                Preview Link
                            </p>
                            <a
                                href={formData.google_maps_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-700 underline break-all"
                            >
                                {formData.google_maps_url}
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Social Media Section */}
            <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Instagram className="w-5 h-5 text-emerald-600" />
                    Media Sosial
                </h3>
                
                <div className="space-y-6">
                    {/* Instagram */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Instagram
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Instagram className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="url"
                                value={socialMedia.instagram || ''}
                                onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="https://instagram.com/lazisnu_mulyoarjo"
                            />
                        </div>
                    </div>

                    {/* TikTok */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            TikTok
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Music className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="url"
                                value={socialMedia.tiktok || ''}
                                onChange={(e) => handleSocialMediaChange('tiktok', e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="https://tiktok.com/@lazisnu_mulyoarjo"
                            />
                        </div>
                    </div>

                    {/* Facebook */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Facebook (Opsional)
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Facebook className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="url"
                                value={socialMedia.facebook || ''}
                                onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="https://facebook.com/lazisnu.mulyoarjo"
                            />
                        </div>
                    </div>

                    {/* YouTube */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            YouTube (Opsional)
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Youtube className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="url"
                                value={socialMedia.youtube || ''}
                                onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="https://youtube.com/@lazisnumulyoarjo"
                            />
                        </div>
                    </div>

                    {/* Twitter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Twitter / X (Opsional)
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Twitter className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="url"
                                value={socialMedia.twitter || ''}
                                onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="https://twitter.com/lazisnumulyoarjo"
                            />
                        </div>
                    </div>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                    Kosongkan field yang tidak digunakan. Link yang diisi akan ditampilkan di halaman Profil publik.
                </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
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