import React from 'react';
import DualValueSection from '@/components/Homepage/DualValueSection';
import EcosystemSection from '@/components/Homepage/EcosystemSection';
import PlatformMagicSection from '@/components/Homepage/PlatformMagicSection';
import AdvancedToolsSection from '@/components/Homepage/AdvancedToolsSection';
import LiveGamesSection from '@/components/Homepage/LiveGamesSection';
import HowItWorksSection from '@/components/Homepage/HowItWorksSection';
import PerfectForSection from '@/components/Homepage/PerfectForSection';
import FAQSection from '@/components/Homepage/FAQSection';
import FinalCTASection from '@/components/Homepage/FinalCTASection';

export const metadata = {
  title: 'Platform Features | EventFi',
  description: 'Explore the powerful features that make EventFi the ultimate all-in-one event platform.',
};

export default function FeaturesPage() {
  return (
    <main className="pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <h1 className="text-4xl lg:text-6xl font-bold font-[family-name:var(--font-clash-display)] mb-6 text-foreground">
          Everything You Need, <br className="hidden sm:block" />
          <span className="text-primary">All In One Place.</span>
        </h1>
        <p className="text-lg lg:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
          From AI-powered event generation to installment payments and verified vendor marketplaces, explore how EventFi makes hosting and attending events magical.
        </p>
      </div>

      <PlatformMagicSection />
      <AdvancedToolsSection />
      <EcosystemSection />
      <LiveGamesSection />
      <DualValueSection />
      <HowItWorksSection />
      <PerfectForSection />
      <FAQSection />
      <FinalCTASection />
    </main>
  );
}
