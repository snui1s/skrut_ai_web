"use client";

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans text-foreground">
      <Header />

      <main className="flex-grow pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-16">
          
          {/* Hero Section */}
          <section className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary tracking-tight">
              Stop drowning in <span className="text-primary italic">Resumes</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              Recruiters today are overwhelmed. When hundreds of candidates apply for a single role, human fatigue leads to missed talent. Skrut AI was built to handle the scale, so you can focus on the people.
            </p>
          </section>

          {/* Mission Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18.1H3"/></svg>
              </div>
              <h2 className="text-2xl font-bold text-secondary">Tackle the Volume</h2>
              <p className="text-foreground/70 leading-relaxed">
                Manually screening 500 resumes for one position is impossible to do fairly. Our AI doesn't get tired. It processes huge volumes of data in seconds, providing a consistent, high-quality analysis for every single applicant without the "mental fatigue" bias.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h2 className="text-2xl font-bold text-secondary">Privacy First</h2>
              <p className="text-foreground/70 leading-relaxed">
                Efficiency shouldn't cost privacy. Skrut AI is stateless—we don't store resumes or build candidate databases. Your high-volume screening stays confidential, secure, and compliant with modern data standards.
              </p>
            </div>
          </section>

          {/* The Advantage Section */}
          <section className="space-y-12">
            <h2 className="text-3xl font-bold text-secondary text-center">The Skrut Edge</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Point 1: Transferable Skills */}
              <div className="bg-gray-50/50 p-7 rounded-3xl border border-secondary/5 space-y-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-5"/><path d="M9 7V2"/><path d="M15 7V2"/><path d="M12 13V7"/><path d="M12 7H5a2 2 0 0 0-2 2v3"/><path d="M12 7h7a2 2 0 0 1 2 2v3"/><rect width="16" height="6" x="4" y="12" rx="2"/></svg>
                </div>
                <h3 className="font-bold text-secondary">Beyond Keywords</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  Skrut AI doesn't just search for words; it understands <strong>"Skill Families."</strong> If you need a React developer, our AI recognizes value in a Vue or Angular background, ensuring you don't miss out on high-potential talent just because of a different tech stack.
                </p>
              </div>

              {/* Point 2: Explainability */}
              <div className="bg-gray-50/50 p-7 rounded-3xl border border-secondary/5 space-y-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <h3 className="font-bold text-secondary">No more Black Boxes</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  Every score comes with a <strong>detailed reasoning log.</strong> You can see exactly how our agents reached their conclusion, providing you with a transparent "second opinion" for every hiring decision.
                </p>
              </div>

              {/* Point 3: OCR */}
              <div className="bg-gray-50/50 p-7 rounded-3xl border border-secondary/5 space-y-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3"/><rect width="18" height="12" x="3" y="10" rx="2"/><path d="M7 14h.01"/><path d="M17 14h.01"/><path d="M12 14h.01"/></svg>
                </div>
                <h3 className="font-bold text-secondary">Scanned-Resume Ready</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  Whether it’s a high-quality PDF or a <strong>mobile-scanned image</strong>, our hybrid OCR engine ensures no candidate is left behind due to poor file formatting or old-school scanning.
                </p>
              </div>
            </div>
          </section>

          {/* Method section */}
          <section className="bg-white rounded-[40px] border border-secondary/10 p-8 md:p-12 shadow-sm space-y-8">
            <h2 className="text-3xl font-bold text-secondary text-center">The "Multi-Agent" Audit</h2>
            <p className="text-center text-foreground/70 max-w-2xl mx-auto">
              We don't just rely on one AI. Skrut AI uses a unique <strong>Reviewer-Auditor loop</strong> to ensure fairness.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
              <div className="space-y-2 text-center">
                <div className="text-primary font-bold text-xl">01. Review</div>
                <p className="text-sm text-foreground/60">An AI Recruiter analyzes the resume for core skills and potential.</p>
              </div>
              <div className="space-y-2 text-center">
                <div className="text-primary font-bold text-xl">02. Audit</div>
                <p className="text-sm text-foreground/60">A Senior Auditor AI checks the review for bias and evidence accuracy.</p>
              </div>
              <div className="space-y-2 text-center">
                <div className="text-primary font-bold text-xl">03. Consolidate</div>
                <p className="text-sm text-foreground/60">The final result is a balanced, honest evaluation you can trust.</p>
              </div>
            </div>
          </section>

          {/* Call to action */}
          <section className="text-center pt-8">
             <h3 className="text-2xl font-bold text-secondary mb-6">Ready to find your next star?</h3>
             <a href="/upload" className="inline-block px-10 py-5 bg-primary text-white rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1">
                Try Skrut AI Now
             </a>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
