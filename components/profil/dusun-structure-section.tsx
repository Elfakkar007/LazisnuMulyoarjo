"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronDown, ChevronUp, MapPin, User } from "lucide-react";

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
  id: string;
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
          const coordinator = dusunPos.members[0]; // First member is coordinator
          const members = dusunPos.members.slice(1); // Rest are members

          return (
            <div
              key={dusunPos.id}
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
                      {dusunPos.members.length} anggota
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
                          <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-white">
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
                                className="bg-white rounded-lg p-4 shadow-sm"
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
      </div>
    </div>
  );
}