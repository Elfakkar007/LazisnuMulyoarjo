"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Users, User } from "lucide-react";

interface StructureMember {
  id: string;
  position_id: string;
  name: string;
  photo_url: string | null;
  dusun: string | null;
  member_order: number | null;
  created_at: string;
}

interface CorePosition {
  position: string;
  members: StructureMember[];
}

interface CoreStructureSectionProps {
  corePositions: CorePosition[];
}

export function CoreStructureSection({ corePositions }: CoreStructureSectionProps) {
  // Special handling for Ketua - make it larger
  const ketuaPosition = corePositions.find(p => p.position === 'Ketua');
  const otherPositions = corePositions.filter(p => p.position !== 'Ketua');

  return (
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
  );
}

interface MemberCardProps {
  member: StructureMember;
  position: string;
  isLarge?: boolean;
}

function MemberCard({ member, position, isLarge = false }: MemberCardProps) {
  return (
    <div className={`bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200 hover:shadow-lg transition-shadow ${
      isLarge ? 'md:p-8' : ''
    }`}>
      {/* Photo */}
      <div className={`relative mx-auto rounded-full overflow-hidden bg-gradient-to-br from-emerald-200 to-teal-200 shadow-lg ${
        isLarge ? 'w-32 h-32 md:w-40 md:h-40 mb-6' : 'w-24 h-24 mb-4'
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
        <h4 className={`font-bold text-gray-900 mb-1 ${
          isLarge ? 'text-xl md:text-2xl' : 'text-base'
        }`}>
          {member.name}
        </h4>
        <p className={`text-emerald-600 font-semibold ${
          isLarge ? 'text-base md:text-lg' : 'text-sm'
        }`}>
          {position}
        </p>
      </div>

      {/* Badge for Ketua */}
      {isLarge && (
        <div className="mt-4 text-center">
          <span className="inline-block bg-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
            PIMPINAN
          </span>
        </div>
      )}
    </div>
  );
}