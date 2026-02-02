import React from 'react';
import type { Metadata } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Our commitment to data privacy and stateless processing of candidate resumes.",
};

export default function PrivacyPolicy() {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans text-foreground">
      <Header />

      <main className="flex-grow pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto space-y-12">
          
          <section className="space-y-3 md:space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary">Privacy Policy</h1>
            <p className="text-xs md:text-sm text-foreground/50 font-medium tracking-wide uppercase">Last Updated: {lastUpdated}</p>
            <p className="text-base md:text-lg text-foreground/70 leading-relaxed pt-2 md:pt-4">
              At Skrut AI, we take your privacy and the security of candidate data extremely seriously. 
              Our architecture is built on the principle of <strong>Stateless Processing</strong>, meaning we don't want your data—we just want to help you analyze it.
            </p>
          </section>

          <hr className="border-secondary/10" />

          {/* Key Principles */}
          <div className="space-y-10">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-secondary">1. No Data Persistence & No Sale</h2>
              <p className="text-foreground/70 leading-relaxed">
                Skrut AI does not maintain a database of resumes or candidate profiles. When you upload a document:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/70 ml-4">
                <li>Text is extracted in-memory or stored in a temporary encrypted directory.</li>
                <li>The file is deleted immediately after the AI analysis is returned to your browser.</li>
                <li><strong>No Third-Party Sharing:</strong> We never sell, rent, or trade candidate data to third parties. Your data is used exclusively for your specific screening session.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-secondary">2. AI Processing via OpenAI (Zero Data Retention)</h2>
              <p className="text-foreground/70 leading-relaxed">
                We utilize OpenAI’s API platform, which is governed by strict privacy policies ensuring that your inputs are <strong>not used for model training</strong>. Data sent via the API is typically deleted from their systems within 30 days (unless otherwise required by law), providing a secure environment for enterprise-grade screening.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-secondary">3. Local Session Storage</h2>
              <p className="text-foreground/70 leading-relaxed">
                For your convenience, analysis results are stored in your browser's <code>sessionStorage</code>. This allows you to revisit the results during your current session. This data never leaves your computer and is cleared when you close your browser tab.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-secondary">4. Ephemeral Image Processing</h2>
              <p className="text-foreground/70 leading-relaxed">
                If a file requires OCR (Optical Character Recognition), temporary images generated are processed in <strong>volatile memory or encrypted temp-folders</strong> and are programmatically purged immediately upon text extraction.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-secondary">5. User Responsibility</h2>
              <p className="text-foreground/70 leading-relaxed">
                Users are responsible for ensuring they have the necessary consent from candidates before uploading their resumes for analysis through Skrut AI. We act as a service provider (Processor) for your internal hiring evaluations.
              </p>
            </section>

            <section className="space-y-4 border-l-4 border-primary pl-6 py-2 bg-primary/5 rounded-r-xl">
              <h2 className="text-xl font-bold text-secondary italic">Our Promise</h2>
              <p className="text-foreground/70 italic">
                "We built Skrut AI to be a tool, not a data harvester. We treat every resume as if it were our own—with total confidentiality and zero footprint."
              </p>
            </section>
          </div>

          <div className="pt-8 text-center">
            <p className="text-sm text-foreground/40">
              Questions about our privacy practices? Contact us at <span className="text-primary font-medium">p.indulakshana@gmail.com</span>
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
