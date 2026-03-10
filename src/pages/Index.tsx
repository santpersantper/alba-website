import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VideoSection from "@/components/VideoSection";
import ForUsersSection from "@/components/ForUsersSection";
import ForOrganizersSection from "@/components/ForOrganizersSection";
import ForBusinessesSection from "@/components/ForBusinessesSection";
import WaitlistSection from "@/components/WaitlistSection";
import AlbaFooter from "@/components/AlbaFooter";

const Index = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <VideoSection />
        <ForUsersSection />
        <ForOrganizersSection />
        <ForBusinessesSection />
        <WaitlistSection />
      </main>
      <AlbaFooter />
    </>
  );
};

export default Index;
