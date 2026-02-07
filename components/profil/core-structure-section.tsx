"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Users, User, Calendar, Quote, Instagram, Facebook, Linkedin } from "lucide-react";

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
  const hasSocialLinks = member.social_links && (
    member.social_links.instagram ||
    member.social_links.facebook ||
    member.social_links.linkedin
  );

  return (
    <div className={`bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200 hover:shadow-lg transition-shadow ${isLarge ? 'md:p-8' : ''
      }`}>
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

        {/* Bio */}
        {member.bio && (
          <p className="text-sm text-gray-600 mt-3 leading-relaxed">
            {member.bio}
          </p>
        )}

        {/* Motto */}
        {member.motto && (
          <div className="mt-3 pt-3 border-t border-emerald-200">
            <div className="flex items-start gap-2">
              <Quote className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-1" />
              <p className="text-xs text-gray-600 italic">
                "{member.motto}"
              </p>
            </div>
          </div>
        )}

        {/* Social Links */}
        {hasSocialLinks && (
          <div className="flex justify-center gap-3 mt-4">
            {member.social_links.instagram && (
              <a
                href={member.social_links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white hover:scale-110 transition-transform"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {member.social_links.facebook && (
              <a
                href={member.social_links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white hover:scale-110 transition-transform"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {member.social_links.linkedin && (
              <a
                href={member.social_links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white hover:scale-110 transition-transform"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
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