"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronDown, ChevronUp, MapPin, User, X, Quote, Instagram, Facebook, Linkedin } from "lucide-react";

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

interface DusunPosition {
    dusun: string;
    members: StructureMember[];
}

interface DusunStructureSectionProps {
    dusunPositions: DusunPosition[];
}

// Dusun colors
const getDusunColor = (dusun: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
        'Pakutukan': {
            bg: 'bg-emerald-100',
            text: 'text-emerald-700',
            border: 'border-emerald-300',
            gradient: 'from-emerald-50 to-emerald-100',
        },
        'Watugel': {
            bg: 'bg-blue-100',
            text: 'text-blue-700',
            border: 'border-blue-300',
            gradient: 'from-blue-50 to-blue-100',
        },
        'Paras': {
            bg: 'bg-purple-100',
            text: 'text-purple-700',
            border: 'border-purple-300',
            gradient: 'from-purple-50 to-purple-100',
        },
        'Ampelgading': {
            bg: 'bg-amber-100',
            text: 'text-amber-700',
            border: 'border-amber-300',
            gradient: 'from-amber-50 to-amber-100',
        },
    };

    return colors[dusun] || {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-300',
        gradient: 'from-gray-50 to-gray-100',
    };
};

export function DusunStructureSection({ dusunPositions }: DusunStructureSectionProps) {
    const [expandedDusun, setExpandedDusun] = useState<Set<string>>(new Set());
    const [selectedMember, setSelectedMember] = useState<{
        member: StructureMember;
        dusun: string;
    } | null>(null);

    const toggleDusun = (dusun: string) => {
        const newExpanded = new Set(expandedDusun);
        if (newExpanded.has(dusun)) {
            newExpanded.delete(dusun);
        } else {
            newExpanded.add(dusun);
        }
        setExpandedDusun(newExpanded);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-md p-8"
            >
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                    Koordinator Dusun
                </h3>

                <div className="space-y-4">
                    {dusunPositions.map((dusunPos) => {
                        const isExpanded = expandedDusun.has(dusunPos.dusun);
                        const colors = getDusunColor(dusunPos.dusun);
                        const coordinator = dusunPos.members.find(m => m.member_order === 0);
                        const members = dusunPos.members.filter(m => m.member_order !== 0);

                        return (
                            <div
                                key={dusunPos.dusun}
                                className={`border-2 rounded-lg overflow-hidden transition-all ${colors.border}`}
                            >
                                {/* Header - Always visible */}
                                <button
                                    onClick={() => toggleDusun(dusunPos.dusun)}
                                    className={`w-full flex items-center justify-between p-5 hover:opacity-90 transition-opacity ${isExpanded ? `bg-gradient-to-r ${colors.gradient}` : 'bg-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center`}>
                                            <MapPin className={`w-6 h-6 ${colors.text}`} />
                                        </div>

                                        <div className="text-left">
                                            <h4 className="text-lg font-bold text-gray-900">
                                                Dusun {dusunPos.dusun}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {coordinator ? coordinator.name : 'Belum ada koordinator'} • {dusunPos.members.length} anggota
                                            </p>
                                        </div>
                                    </div>

                                    {isExpanded ? (
                                        <ChevronUp className="w-6 h-6 text-gray-600" />
                                    ) : (
                                        <ChevronDown className="w-6 h-6 text-gray-600" />
                                    )}
                                </button>

                                {/* Content - Expandable */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className={`p-6 border-t-2 ${colors.border} bg-gradient-to-br ${colors.gradient}`}>
                                                {/* Coordinator */}
                                                {coordinator && (
                                                    <div className="mb-6">
                                                        <h5 className="text-sm font-bold text-gray-700 uppercase mb-3">
                                                            Koordinator
                                                        </h5>
                                                        <div
                                                            className="bg-white rounded-lg p-4 shadow-sm border-2 border-white cursor-pointer hover:shadow-md transition-shadow"
                                                            onClick={() => setSelectedMember({ member: coordinator, dusun: dusunPos.dusun })}
                                                        >
                                                            <DusunMemberCard member={coordinator} isCoordinator />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Members */}
                                                {members.length > 0 && (
                                                    <div>
                                                        <h5 className="text-sm font-bold text-gray-700 uppercase mb-3">
                                                            Anggota
                                                        </h5>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                            {members.map((member) => (
                                                                <div
                                                                    key={member.id}
                                                                    className="bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                                                    onClick={() => setSelectedMember({ member, dusun: dusunPos.dusun })}
                                                                >
                                                                    <DusunMemberCard member={member} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {dusunPos.members.length === 0 && (
                                                    <p className="text-center text-gray-500 py-8">
                                                        Belum ada anggota terdaftar
                                                    </p>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                {dusunPositions.length === 0 && (
                    <div className="text-center py-12">
                        <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Belum ada data koordinator dusun</p>
                    </div>
                )}
            </motion.div>

            {/* Modal Detail */}
            <DusunProfileModal
                member={selectedMember?.member || null}
                dusun={selectedMember?.dusun || ''}
                onClose={() => setSelectedMember(null)}
            />
        </>
    );
}

interface DusunMemberCardProps {
    member: StructureMember;
    isCoordinator?: boolean;
}

function DusunMemberCard({ member, isCoordinator = false }: DusunMemberCardProps) {
    return (
        <div className="flex items-center gap-3">
            {/* Photo */}
            <div className={`relative rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 shadow flex-shrink-0 ${isCoordinator ? 'w-14 h-14' : 'w-12 h-12'
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
                        <User className={`text-gray-500 ${isCoordinator ? 'w-7 h-7' : 'w-6 h-6'}`} />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className={`font-semibold text-gray-900 truncate ${isCoordinator ? 'text-base' : 'text-sm'
                    }`}>
                    {member.name}
                </p>
                {isCoordinator && (
                    <span className="inline-block text-xs font-bold text-emerald-600 mt-1">
                        KOORDINATOR
                    </span>
                )}
                {member.bio && !isCoordinator && (
                    <p className="text-xs text-gray-500 truncate mt-1">{member.bio}</p>
                )}
            </div>
        </div>
    );
}

interface DusunProfileModalProps {
    member: StructureMember | null;
    dusun: string;
    onClose: () => void;
}

function DusunProfileModal({ member, dusun, onClose }: DusunProfileModalProps) {
    if (!member) return null;

    const colors = getDusunColor(dusun);
    const isCoordinator = member.member_order === 0;

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
                    <div className={`relative bg-gradient-to-br ${colors.gradient.replace('from-', 'from-').replace('to-', 'to-')} p-8`}>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-700" />
                        </button>

                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Photo */}
                            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white shadow-xl flex-shrink-0 ring-4 ring-white/50">
                                {member.photo_url ? (
                                    <Image
                                        src={member.photo_url}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                        <User className="w-16 h-16 text-gray-400" />
                                    </div>
                                )}
                            </div>

                            {/* Name & Position */}
                            <div className="text-center md:text-left flex-1">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">{member.name}</h2>
                                <div className="flex flex-col gap-2">
                                    {isCoordinator && (
                                        <span className="inline-block bg-emerald-600 text-white text-sm font-bold px-4 py-1.5 rounded-full w-fit mx-auto md:mx-0">
                                            KOORDINATOR
                                        </span>
                                    )}
                                    <p className={`text-lg font-semibold ${colors.text}`}>
                                        Dusun {dusun}
                                    </p>
                                </div>

                                {/* Social Links - Header */}
                                {hasSocialLinks && (
                                    <div className="flex justify-center md:justify-start gap-3 mt-3">
                                        {member.social_links.instagram && (
                                            <a
                                                href={member.social_links.instagram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:scale-110 flex items-center justify-center text-white transition-all"
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
                                                className="w-10 h-10 rounded-full bg-blue-600 hover:scale-110 flex items-center justify-center text-white transition-all"
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
                                                className="w-10 h-10 rounded-full bg-blue-700 hover:scale-110 flex items-center justify-center text-white transition-all"
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
                                <div className={`bg-gradient-to-br ${colors.gradient} p-6 rounded-lg border-l-4 ${colors.border}`}>
                                    <p className="text-gray-800 italic text-lg font-medium">
                                        "{member.motto}"
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* If no additional info */}
                        {!member.bio && !member.motto && (
                            <div className="text-center py-8">
                                <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">Tidak ada informasi tambahan</p>
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