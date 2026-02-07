"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Building2,
  Eye,
  Target,
  Users,
  Mail,
  Phone,
  MapPin,
  User,
} from "lucide-react";
import { AboutSection } from "./about-section";
import { VisionMissionSection } from "./vision-mission-section";
import { CoreStructureSection } from "./core-structure-section";
import { DusunStructureSection } from "./dusun-structure-section";
import { ContactSection } from "./contact-section";

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
  id: string;
  position: string;
  members: StructureMember[];
}

interface DusunPosition {
  id: string;
  dusun: string;
  members: StructureMember[];
}

interface StructureData {
  core: CorePosition[];
  dusun: DusunPosition[];
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
  updated_at: string;
}

interface ProfileContentProps {
  profile: OrganizationProfile;
  structureData: StructureData;
}

export function ProfileContent({ profile, structureData }: ProfileContentProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* A. About Organization */}
        <AboutSection profile={profile} />

        {/* Vision & Mission */}
        <VisionMissionSection profile={profile} />

        {/* B. Organization Structure - Core Team */}
        <CoreStructureSection corePositions={structureData.core} />

        {/* B. Organization Structure - Dusun Coordinators */}
        <DusunStructureSection dusunPositions={structureData.dusun} />

        {/* C. Contact Information */}
        <ContactSection profile={profile} />

      </div>
    </div>
  );
}