import FeaturesSection from '@/components/features/landing/FeaturesSection';
import ComparisonSection from '@/components/features/landing/ComparisonSection';
import HeroSection from '@/components/features/landing/HeroSection';
import HowItWorksSection from '@/components/features/landing/HowItWorksSection';
import FaqSection from '@/components/features/landing/FaqSection';
import CTASection from '@/components/features/landing/CTASection';
import PricingSection from '@/components/features/landing/PricingSection';
import { ScrollReveal, ScrollRevealList } from '@/components/ui/animations/ScrollReveal';

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-x-hidden overflow-y-visible">
      {/* Smooth Animated Mesh Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-white dark:bg-slate-950">
          {/* Purple blob — slow drift */}
          <div
              className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-3xl"
              style={{ animation: 'kio-blob-drift-1 15s ease-in-out infinite' }}
          />
          {/* Violet blob — medium drift */}
          <div
              className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-violet-500/15 blur-3xl"
              style={{ animation: 'kio-blob-drift-2 12s ease-in-out infinite' }}
          />
          {/* Amber accent blob — fast drift */}
          <div
              className="absolute bottom-0 left-1/3 w-[450px] h-[450px] rounded-full bg-amber-500/10 blur-3xl"
              style={{ animation: 'kio-blob-drift-3 8s ease-in-out infinite' }}
          />
          {/* Subtle circuit-board pattern overlay */}
          <svg
              className="absolute right-0 top-0 h-full w-1/2 opacity-[0.04] mix-blend-overlay pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
          >
              <defs>
                  <pattern id="circuit" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                      <path d="M30 0v30h30M0 30h30v30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                      <circle cx="30" cy="30" r="2" fill="currentColor" />
                  </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#circuit)" className="text-purple-900" />
          </svg>
      </div>

      <HeroSection />

      <ScrollRevealList className="w-full">
        <div id="features" className="w-full scroll-mt-20"><FeaturesSection /></div>
      </ScrollRevealList>
      
      <ScrollReveal className="w-full">
        <div id="comparison" className="w-full scroll-mt-20"><ComparisonSection /></div>
      </ScrollReveal>
      
      <ScrollRevealList className="w-full">
        <div id="how-it-works" className="w-full scroll-mt-20"><HowItWorksSection /></div>
      </ScrollRevealList>
      
      <ScrollRevealList className="w-full">
        <div id="pricing" className="w-full scroll-mt-20"><PricingSection /></div>
      </ScrollRevealList>
      
      <ScrollReveal className="w-full">
        <div id="faq" className="w-full scroll-mt-20"><FaqSection /></div>
      </ScrollReveal>
      
      <ScrollReveal className="w-full">
        <div id="contact" className="w-full scroll-mt-20"><CTASection /></div>
      </ScrollReveal>

    </main>
  );
}
