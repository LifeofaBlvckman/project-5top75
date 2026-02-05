import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import CallToActionSection from '@/components/CallToActionSection';
import FooterSection from '@/components/FooterSection';

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start antialiased">
      <HeroSection />
      <FeaturesSection />
      <CallToActionSection />
      <FooterSection />
    </main>
  );
}