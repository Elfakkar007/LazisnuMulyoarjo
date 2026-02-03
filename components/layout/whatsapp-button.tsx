"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface WhatsAppFloatingButtonProps {
  phoneNumber: string | null;
}

export function WhatsAppFloatingButton({ phoneNumber }: WhatsAppFloatingButtonProps) {
  if (!phoneNumber) return null;

  const formattedNumber = phoneNumber.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=Assalamualaikum,%20saya%20ingin%20bertanya%20tentang%20LazisNU%20Mulyoarjo`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <MessageCircle className="w-6 h-6" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Hubungi Kami via WhatsApp
      </span>

      {/* Pulse Animation */}
      <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
    </motion.a>
  );
}