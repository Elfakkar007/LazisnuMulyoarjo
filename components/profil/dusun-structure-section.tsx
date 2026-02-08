"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MapPin, User, X, Quote, Instagram, Facebook, Linkedin } from "lucide-react";

interface StructureMember {
  id: string;
  name: string;
  photo_url: string | null;
  bio: string | null;
  motto: string | null;
  social_links: any;
  dusun: string | null;
  position_role?: string; // Koordinator atau Anggota
}

interface DusunPosition {
  id: string;
  dusun: string;
  members: StructureMember[];
}

interface DusunStructureSectionProps {
  dusunPositions: DusunPosition[];
}

// Warna per dusun
const getDusunColor = (dusun: string) => {
  const colors: Record<string, { bg: string; border: string; text: string; photoBorder: string }> = {
    'Pakutukan': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', photoBorder: 'border-emerald-500' },
    'Watugel': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', photoBorder: 'border-blue-500' },
    'Paras': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', photoBorder: 'border-purple-500' },
    'Ampelgading': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', photoBorder: 'border-amber-500' },
  };
  return colors[dusun] || { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', photoBorder: 'border-gray-500' };
};

export function DusunStructureSection({ dusunPositions }: DusunStructureSectionProps) {
  const [selectedMember, setSelectedMember] = useState<{
    member: StructureMember;
    dusun: string;
    position: string;
  } | null>(null);

  // Grouping berdasarkan dusun
  const groupedDusun = useMemo(() => {
    const groups: Record<string, StructureMember[]> = {};

    dusunPositions.forEach(pos => {
      const dusunName = pos.dusun || "Lainnya";

      if (!groups[dusunName]) {
        groups[dusunName] = [];
      }

      groups[dusunName].push(...pos.members);
    });

    return Object.entries(groups).map(([dusun, members]) => ({
      dusun,
      members: members.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    }));
  }, [dusunPositions]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm p-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-emerald-600 rounded-lg p-2">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Koordinator Dusun</h2>
        </div>

        <div className="space-y-8">
          {groupedDusun.map((group, groupIndex) => {
            const colors = getDusunColor(group.dusun);

            return (
              <motion.div
                key={group.dusun}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (groupIndex * 0.1) }}
                className={`border-2 rounded-xl overflow-hidden ${colors.border}`}
              >
                {/* Header Dusun */}
                <div className={`${colors.bg} px-6 py-4 border-b-2 ${colors.border}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${colors.bg} border-2 ${colors.border} flex items-center justify-center`}>
                        <MapPin className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${colors.text}`}>
                          Dusun {group.dusun}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {group.members.length} anggota
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid Members */}
                <div className="p-6 bg-white">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {group.members.map((member, memberIndex) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + (memberIndex * 0.05) }}
                        whileHover={{ y: -5 }}
                        onClick={() => setSelectedMember({
                          member,
                          dusun: group.dusun,
                          position: "Koordinator"
                        })}
                        className="flex flex-col items-center cursor-pointer group"
                      >
                        <div className="relative w-24 h-24 aspect-square mb-3">
                          <div className={`relative w-full h-full rounded-full overflow-hidden border-4 ${colors.photoBorder} shadow-md group-hover:shadow-lg transition-all`}>
                            {member.photo_url ? (
                              <Image
                                src={member.photo_url}
                                alt={member.name}
                                fill
                                className="object-cover"
                                sizes="96px"
                              />
                            ) : (
                              <div className={`w-full h-full ${colors.bg} flex items-center justify-center`}>
                                <User className="w-10 h-10 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </div>
                        <h4 className={`font-bold text-gray-900 text-center text-sm mb-1 group-hover:${colors.text} transition-colors px-2 line-clamp-2`}>
                          {member.name}
                        </h4>
                        <p className="text-xs text-gray-500 text-center">
                          {member.position_role || "Koordinator"}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {groupedDusun.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada data koordinator dusun</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal Detail Profil - Responsive & Better Image Display */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              {/* Photo Section - Responsive */}
              <div className={`pt-8 pb-6 px-4 sm:px-8 flex flex-col items-center bg-gradient-to-b ${getDusunColor(selectedMember.dusun).bg} to-white`}>
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 aspect-square rounded-full overflow-hidden bg-white shadow-2xl ring-4 ring-white/50 mb-4">
                  {selectedMember.member.photo_url ? (
                    <Image
                      src={selectedMember.member.photo_url}
                      alt={selectedMember.member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 160px, 192px"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <User className="w-20 h-20 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Name & Position */}
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2 px-4">
                  {selectedMember.member.name}
                </h2>
                <p className={`text-base sm:text-lg font-semibold ${getDusunColor(selectedMember.dusun).text} text-center mb-1 px-4`}>
                  {selectedMember.member.position_role || selectedMember.position}
                </p>
                <p className="text-sm sm:text-base text-gray-600 text-center px-4">
                  Dusun {selectedMember.dusun}
                </p>
              </div>

              {/* Content - Responsive */}
              <div className="px-4 sm:px-8 pb-6 sm:pb-8 space-y-4 sm:space-y-6">
                {/* Social Links */}
                {selectedMember.member.social_links && (
                  selectedMember.member.social_links.instagram ||
                  selectedMember.member.social_links.facebook ||
                  selectedMember.member.social_links.linkedin
                ) && (
                    <div className="flex justify-center gap-3 pb-4 border-b border-gray-200">
                      {selectedMember.member.social_links.instagram && (
                        <a
                          href={selectedMember.member.social_links.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:scale-110 flex items-center justify-center text-white transition-all shadow-md"
                          aria-label="Instagram"
                        >
                          <Instagram className="w-5 h-5" />
                        </a>
                      )}
                      {selectedMember.member.social_links.facebook && (
                        <a
                          href={selectedMember.member.social_links.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-blue-600 hover:scale-110 flex items-center justify-center text-white transition-all shadow-md"
                          aria-label="Facebook"
                        >
                          <Facebook className="w-5 h-5" />
                        </a>
                      )}
                      {selectedMember.member.social_links.linkedin && (
                        <a
                          href={selectedMember.member.social_links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-blue-700 hover:scale-110 flex items-center justify-center text-white transition-all shadow-md"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  )}

                {/* Bio */}
                {selectedMember.member.bio && (
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                      Profil Singkat
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed bg-gray-50 p-3 sm:p-4 rounded-lg">
                      {selectedMember.member.bio}
                    </p>
                  </div>
                )}

                {/* Motto */}
                {selectedMember.member.motto && (
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                      Motto
                    </h3>
                    <div className={`${getDusunColor(selectedMember.dusun).bg} p-3 sm:p-4 rounded-lg border-l-4 ${getDusunColor(selectedMember.dusun).border}`}>
                      <p className="text-sm sm:text-base text-gray-800 italic font-medium">
                        "{selectedMember.member.motto}"
                      </p>
                    </div>
                  </div>
                )}

                {/* No additional info */}
                {!selectedMember.member.bio && !selectedMember.member.motto && (
                  <div className="text-center py-6">
                    <User className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Tidak ada informasi tambahan</p>
                  </div>
                )}

                {/* Close Button */}
                <div className="pt-2 sm:pt-4">
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 sm:py-3 px-6 rounded-lg transition-colors text-sm sm:text-base"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}