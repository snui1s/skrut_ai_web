import dynamic from 'next/dynamic';
import Header from "./components/Header";
import Hero from "./components/Hero";
import WavyDivider from "./components/WavyDivider";

const WhatIsSkrut = dynamic(() => import("./components/WhatIsSkrut"));
const HowItWorks = dynamic(() => import("./components/HowItWorks"));
const ComparisonTable = dynamic(() => import("./components/ComparisonTable"));
const FAQ = dynamic(() => import("./components/FAQ"));
const CTA = dynamic(() => import("./components/CTA"));
const Footer = dynamic(() => import("./components/Footer"));

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-background font-sans text-foreground pb-[env(safe-area-inset-bottom)] antialiased">
      <Header />
      <Hero />
      <div className="max-w-3xl mx-auto px-4 md:px-0"><WavyDivider variant={1} /></div>
      <WhatIsSkrut />
      <div className="max-w-3xl mx-auto px-4 md:px-0"><WavyDivider variant={3} /></div>
      <HowItWorks />
      <div className="max-w-3xl mx-auto px-4 md:px-0"><WavyDivider variant={2} /></div>
      <ComparisonTable />
      <div className="max-w-3xl mx-auto px-4 md:px-0"><WavyDivider variant={3} /></div>
      <FAQ />
      <div className="max-w-3xl mx-auto px-4 md:px-0"><WavyDivider variant={1} /></div>
      <CTA />
      <Footer />
    </main>
  );
}
