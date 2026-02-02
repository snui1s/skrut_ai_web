
import Header from "./components/Header";
import Hero from "./components/Hero";
import WhatIsSkrut from "./components/WhatIsSkrut";
import HowItWorks from "./components/HowItWorks";
import ComparisonTable from "./components/ComparisonTable";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import WavyDivider from "./components/WavyDivider";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-background font-sans text-foreground">
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
