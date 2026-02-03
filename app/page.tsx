import { HeroSection } from "@/components/home/hero-section";
import { StatsCards } from "@/components/home/stats-cards";
import { ChartSection } from "@/components/home/chart-section";
import { RecentActivities } from "@/components/home/recent-activities";
import {
  getHomepageSlides,
  getTotalKalengDistributed,
  getCurrentMonthIncome,
  getActiveFinancialYear,
  getMonthlyTrendData,
  getRecentActivities,
} from "@/lib/api/public";

export default async function Home() {
  // Fetch all data in parallel for better performance
  const [
    slides,
    totalKaleng,
    currentMonthIncome,
    activeYear,
    monthlyTrendData,
    recentActivities,
  ] = await Promise.all([
    getHomepageSlides(),
    getTotalKalengDistributed(),
    getCurrentMonthIncome(),
    getActiveFinancialYear(),
    getMonthlyTrendData(),
    getRecentActivities(5),
  ]);

  return (
    <>
      {/* Hero Section with Carousel */}
      <HeroSection slides={slides} />

      {/* Statistics Cards */}
      <StatsCards
        totalKaleng={totalKaleng}
        currentMonthIncome={currentMonthIncome}
        activeYear={activeYear}
      />

      {/* Monthly Trend Chart */}
      <ChartSection
        data={monthlyTrendData}
        yearLabel={activeYear ? `tahun ${activeYear.year}` : undefined}
      />

      {/* Recent Activities */}
      <RecentActivities articles={recentActivities} />
    </>
  );
}