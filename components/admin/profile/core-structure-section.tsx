"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
    Users,
    User,
    Calendar,
    Quote,
    Instagram,
    Facebook,
    Linkedin,
    X,
    Mail,
    Phone
} from "lucide-react";

interface StructureMember {
    id: string;
    position_id: string;
    name: string;
    photo_url: string | null;
    dusun: string | null;
    member_order: number | null;
    bio: string | null;
    motto: string | null;
    social_links: any;
    created_at: string;
}

interface CorePosition {
    position: string;
    position_data?: any;
    members: StructureMember[];
}

interface CoreStructureSectionProps {
    corePositions: CorePosition[];
}

export function CoreStructureSection({ corePositions }: CoreStructureSectionProps) {
    const [selectedMember, setSelectedMember] = useState<{
        member: StructureMember;
        position: string;
    } | null>(null);

    // Special handling for Ketua - make it larger
    const ketuaPosition = corePositions.find(p => p.position === 'Ketua');
    const otherPositions = corePositions.filter(p => p.position !== 'Ketua');

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-md p-8"
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-emerald-600 rounded-lg p-2">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Struktur Organisasi
                    </h2>
                </div>

                {/* Show tenure period if available */}
                {ketuaPosition?.position_data?.tenure_period && (
                    <div className="mb-6 flex items-center gap-2 text-gray-600">
                        <Calendar className="w-5 h-5" />
                        <span className="font-semibold">
                            Masa Bakti: {ketuaPosition.position_data.tenure_period}
                        </span>
                    </div>
                )}

                <h3 className="text-xl font-bold text-gray-800 mb-6">Pengurus Inti</h3>

                {/* Ketua - Larger Card */}
                {ketuaPosition && ketuaPosition.members.length > 0 && (
                    <div className="mb-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="max-w-sm mx-auto"
                        >
                            <MemberCard
                                member={ketuaPosition.members[0]}
                                position={ketuaPosition.position}
                                isLarge
                                onClick={() => setSelectedMember({
                                    member: ketuaPosition.members[0],
                                    position: ketuaPosition.position,
                                })}
                            />
                        </motion.div>
                    </div>
                )}

                {/* Other Positions - Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {otherPositions.map((position, posIndex) =>
                        position.members.map((member, memberIndex) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + (posIndex * 0.1) + (memberIndex * 0.05) }}
                            >
                                <MemberCard
                                    member={member}
                                    position={position.position}
                                    onClick={() => setSelectedMember({
                                        member,
                                        position: position.position,
                                    })}
                                />
                            </motion.div>
                        ))
                    )}
                </div>

                {corePositions.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Belum ada data pengurus inti</p>
                    </div>
                )}
            </motion.div>

            {/* Modal Detail */}
            <ProfileModal
                member={selectedMember?.member || null}
                position={selectedMember?.position || ''}
                onClose={() => setSelectedMember(null)}
            />
        </>
    );
}

interface MemberCardProps {
    member: StructureMember;
    position: string;
    isLarge?: boolean;
    onClick?: () => void;
}

function MemberCard({ member, position, isLarge = false, onClick }: MemberCardProps) {
    const hasSocialLinks = member.social_links && (
        member.social_links.instagram ||
        member.social_links.facebook ||
        member.social_links.linkedin
    );

    const hasDetailedInfo = member.bio || member.motto || hasSocialLinks;

    return (
        <div
            className={`bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200 transition-all ${hasDetailedInfo ? 'cursor-pointer hover:shadow-xl hover:scale-105' : 'hover:shadow-lg'
                } ${isLarge ? 'md:p-8' : ''}`}
            onClick={hasDetailedInfo ? onClick : undefined}
        >
            {/* Photo */}
            <div className={`relative mx-auto rounded-full overflow-hidden bg-gradient-to-br from-emerald-200 to-teal-200 shadow-lg ${isLarge ? 'w-32 h-32 md:w-40 md:h-40 mb-6' : 'w-24 h-24 mb-4'
                }`}>
                {member.photo_url ? (
                    <Image
                        src={member.photo_url}
                        alt={member.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <User className={`text-emerald-600 ${isLarge ? 'w-16 h-16' : 'w-12 h-12'}`} />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="text-center">
                <h4 className={`font-bold text-gray-900 mb-1 ${isLarge ? 'text-xl md:text-2xl' : 'text-base'
                    }`}>
                    {member.name}
                </h4>
                <p className={`text-emerald-600 font-semibold mb-2 ${isLarge ? 'text-base md:text-lg' : 'text-sm'
                    }`}>
                    {position}
                </p>

                {/* Badge for Ketua */}
                {isLarge && (
                    <div className="mt-3">
                        <span className="inline-block bg-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                            PIMPINAN
                        </span>
                    </div>
                )}

                {/* Click hint */}
                {hasDetailedInfo && (
                    <p className="text-xs text-gray-500 mt-3 italic">
                        Klik untuk info lengkap
                    </p>
                )}
            </div>
        </div>
    );
}

interface ProfileModalProps {
    member: StructureMember | null;
    position: string;
    onClose: () => void;
}

function ProfileModal({ member, position, onClose }: ProfileModalProps) {
    if (!member) return null;

    const hasSocialLinks = member.social_links && (
        member.social_links.instagram ||
        member.social_links.facebook ||
        member.social_links.linkedin
    );

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Photo */}
                            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white/20 shadow-xl flex-shrink-0 ring-4 ring-white/30">
                                {member.photo_url ? (
                                    <Image
                                        src={member.photo_url}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <User className="w-16 h-16 text-white/60" />
                                    </div>
                                )}
                            </div>

                            {/* Name & Position */}
                            <div className="text-center md:text-left flex-1">
                                <h2 className="text-3xl font-bold mb-2">{member.name}</h2>
                                <p className="text-lg font-semibold text-emerald-100 mb-3">{position}</p>

                                {/* Social Links - Header */}
                                {hasSocialLinks && (
                                    <div className="flex justify-center md:justify-start gap-3">
                                        {member.social_links.instagram && (
                                            <a
                                                href={member.social_links.instagram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110"
                                                aria-label="Instagram"
                                            >
                                                <Instagram className="w-5 h-5" />
                                            </a>
                                        )}
                                        {member.social_links.facebook && (
                                            <a
                                                href={member.social_links.facebook}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110"
                                                aria-label="Facebook"
                                            >
                                                <Facebook className="w-5 h-5" />
                                            </a>
                                        )}
                                        {member.social_links.linkedin && (
                                            <a
                                                href={member.social_links.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110"
                                                aria-label="LinkedIn"
                                            >
                                                <Linkedin className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-6">
                        {/* Bio */}
                        {member.bio && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <User className="w-5 h-5 text-emerald-600" />
                                    Profil Singkat
                                </h3>
                                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                                    {member.bio}
                                </p>
                            </div>
                        )}

                        {/* Motto */}
                        {member.motto && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Quote className="w-5 h-5 text-emerald-600" />
                                    Motto
                                </h3>
                                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-lg border-l-4 border-emerald-600">
                                    <p className="text-gray-800 italic text-lg font-medium">
                                        "{member.motto}"
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Contact Info (jika ada di social_links) */}
                        {member.social_links?.email && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Kontak</h3>
                                <div className="space-y-2">
                                    <a
                                        href={`mailto:${member.social_links.email}`}
                                        className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <Mail className="w-5 h-5 text-emerald-600" />
                                        <span className="text-gray-700">{member.social_links.email}</span>
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Close Button */}
                        <div className="pt-4 border-t border-gray-200">
                            <button
                                onClick={onClose}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}