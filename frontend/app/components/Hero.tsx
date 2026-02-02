"use client";

import React, { useEffect, useState } from 'react';

export default function Hero() {
  const [hasRecentResults, setHasRecentResults] = useState(false);

  useEffect(() => {
    const results = sessionStorage.getItem('latest_analysis_results');
    const single = sessionStorage.getItem('latest_analysis');
    if (results || single) {
      setHasRecentResults(true);
    }
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden">
      {/* Background Gradient/Effect - Minimal */}
      <div className="absolute inset-0 bg-background -z-10"></div>
      <div className="absolute w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10"></div>

      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-secondary leading-tight">
          Smarter Hiring, <br />
          <span className="text-primary relative">
            Faster Decisions
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
               <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
            </svg>
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto leading-relaxed">
          Transform how you evaluate candidates. Upload resumes and get detailed, AI-driven insights in seconds, not hours.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <a href="/upload" className="px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg hover:bg-opacity-90 transition-all shadow-xl shadow-primary/25 hover:shadow-2xl hover:-translate-y-1">
            Start Evaluating Free
          </a>

          {hasRecentResults && (
            <a href="/results/latest" className="px-8 py-4 bg-white border-2 border-primary text-primary rounded-full font-semibold text-lg hover:bg-primary/5 transition-all">
              View Latest Results
            </a>
          )}

          <a href="#how-it-works" className="px-8 py-4 bg-transparent border-2 border-foreground/20 text-secondary rounded-full font-semibold text-lg hover:bg-foreground/5 transition-all">
            See How It Works
          </a>
        </div>

        {/* Minimal trusted by or metrics could go here */}
        <div className="pt-16 grid grid-cols-3 gap-8 text-foreground/60 text-sm font-medium">
           <div>
              <span className="block text-3xl font-bold text-secondary mb-1">98%</span>
              Accuracy
           </div>
           <div>
              <span className="block text-3xl font-bold text-secondary mb-1">10x</span>
              Faster Screening
           </div>
           <div>
              <span className="block text-3xl font-bold text-secondary mb-1">24/7</span>
              Availability
           </div>
        </div>
      </div>
    </section>
  );
}
