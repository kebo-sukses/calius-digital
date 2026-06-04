import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryShowcase from "@/components/CategoryShowcase";
import FlashSaleSection from "@/components/FlashSaleSection";
import ValueProposition from "@/components/ValueProposition";
import TestimonialSection from "@/components/TestimonialSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <HeroSection />
      <CategoryShowcase />
      <FlashSaleSection />
      <ValueProposition />
      <TestimonialSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
