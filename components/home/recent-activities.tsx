"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { recentActivities } from "@/lib/dummy-data";
import Image from "next/image";

const categoryColors: Record<string, string> = {
  Sosial: "bg-blue-100 text-blue-700",
  Kesehatan: "bg-green-100 text-green-700",
  Keagamaan: "bg-purple-100 text-purple-700",
};

export function RecentActivities() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Kegiatan Terbaru
          </h2>
          <p className="text-gray-600 font-medium">
            Dokumentasi program yang telah terlaksana
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-emerald-200 overflow-hidden">
                {/* Placeholder Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Calendar className="w-16 h-16 text-emerald-300" />
                </div>
                <div className="absolute top-3 left-3">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      categoryColors[activity.category] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {activity.category}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                  {activity.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{activity.date}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-10"
        >
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all">
            Lihat Semua Kegiatan
          </button>
        </motion.div>
      </div>
    </section>
  );
}