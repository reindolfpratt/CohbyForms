import { CTASection } from "./components/CTASection";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { LandingNavbar } from "./components/Navbar";
import { Stats } from "./components/Stats";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <LandingNavbar />
      <main>
        <Hero />
        <Features />
        <Stats />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
