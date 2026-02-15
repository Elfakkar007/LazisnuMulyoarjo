"use client";

import { motion } from "framer-motion";
import { Eye, Target } from "lucide-react";

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

interface VisionMissionSectionProps {
  profile: OrganizationProfile;
}

export function VisionMissionSection({ profile }: VisionMissionSectionProps) {
  // Parse mission if it contains newlines or numbered lists
  const parseMission = (missionText: string) => {
    // Split by newlines and filter empty lines
    const lines = missionText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    return lines;
  };

  const missionItems = parseMission(profile.mission);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Vision */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-md p-8 border border-emerald-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-600 rounded-lg p-2">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Visi</h3>
        </div>
        
        <p className="text-gray-700 leading-relaxed text-lg font-medium">
          {profile.vision}
        </p>
      </motion.div>

      {/* Mission */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-md p-8 border border-blue-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-600 rounded-lg p-2">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Misi</h3>
        </div>
        
        <ul className="space-y-3">
          {missionItems.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                {index + 1}
              </span>
              <span className="text-gray-700 leading-relaxed flex-1">
                {item.replace(/^\d+\.\s*/, '')} {/* Remove number prefix if exists */}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
