// =====================================================
// PROFILE CMS PAGE - FINAL FIXED VERSION
// File: app/admin/(dashboard)/profile/page.tsx
// =====================================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Save,
    Building2,
    Mail,
    Phone,
    MapPin,
    Users,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { getOrganizationProfile, getStructureData } from '@/lib/api/client-admin';
import {
    updateOrganizationProfile,
} from '@/lib/actions/admin';
import { useToast } from '@/components/ui/toast-provider';

// Import components
import { GeneralInfoSection } from '@/components/admin/profile/general-info-section';
import { ContactSection } from '@/components/admin/profile/contact-section';
import { StructureCMSSection } from '@/components/admin/profile/structure-cms-section';

// Use the same interface as ContactSection to avoid conflicts
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
    social_media_links: SocialMediaLinks | null;  // Changed from optional to required
    updated_at: string;
}

interface StructureData {
    core: any[];
    dusun: any[];
}

export default function ProfileCMSPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'structure'>('general');
    // Removed local error/success states
    const { toast, success, error } = useToast();


    // Profile data
    const [profile, setProfile] = useState<OrganizationProfile | null>(null);
    const [structureData, setStructureData] = useState<StructureData>({
        core: [],
        dusun: [],
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [profileData, structure] = await Promise.all([
                getOrganizationProfile(),
                getStructureData(),
            ]);

            setProfile(profileData);

            if (structure) {
                setStructureData(structure);
            }
        } catch (err) {
            console.error('Error loading data:', err);
            error('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async (updatedProfile: Partial<OrganizationProfile>) => {
        if (!profile) return;

        setSaving(true);
        // Removed local error/success state resets

        try {
            // Convert social_media_links to JSON format for database
            const dataToSave: any = {
                id: profile.id,
                ...updatedProfile,
            };

            // Ensure social_media_links is properly formatted as JSON
            if (updatedProfile.social_media_links !== undefined) {
                dataToSave.social_media_links = updatedProfile.social_media_links as any;
            }

            const result = await updateOrganizationProfile(dataToSave);

            if (result.success) {
                success('Profil berhasil diperbarui!');
                await loadData();
            } else {
                error((result as any).message || 'Gagal menyimpan profil');
            }
        } catch (err) {
            console.error('Error saving profile:', err);
            error('Terjadi kesalahan saat menyimpan');
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        {
            id: 'general' as const,
            label: 'Informasi Umum',
            icon: Building2,
        },
        {
            id: 'contact' as const,
            label: 'Kontak',
            icon: Mail,
        },
        {
            id: 'structure' as const,
            label: 'Struktur Organisasi',
            icon: Users,
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
                    <p className="text-gray-600">Memuat data profil...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                    <p className="text-gray-600">Data profil tidak ditemukan</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Kelola Profil</h1>
                    <p className="text-gray-600 mt-1">
                        Perbarui informasi profil organisasi
                    </p>
                </div>
            </div>

            {/* Success/Error Messages - Removed local messages, now handled by useToast */}

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="border-b border-gray-200">
                    <div className="flex">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors ${isActive
                                        ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="hidden md:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'general' && (
                        <GeneralInfoSection
                            profile={profile}
                            onSave={handleSaveProfile}
                            saving={saving}
                        />
                    )}

                    {activeTab === 'contact' && (
                        <ContactSection
                            profile={profile}
                            onSave={handleSaveProfile}
                            saving={saving}
                        />
                    )}

                    {activeTab === 'structure' && (
                        <StructureCMSSection onDataChange={loadData} />
                    )}
                </div>
            </div>
        </div>
    );
}
