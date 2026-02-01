import { HeroSection } from "@/components/home/hero-section";
import { StatsChart } from "@/components/home/stats-chart";
import { RecentActivities } from "@/components/home/recent-activities";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsChart />
      <RecentActivities />
    </>
  );
}