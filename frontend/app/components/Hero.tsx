"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-20 px-4 md:px-6 overflow-hidden flex flex-col items-center">
      {/* Background Gradient/Effect - Minimal */}
      <div className="absolute inset-0 bg-background -z-10"></div>
      
      <div className="max-w-5xl w-full flex flex-col items-center text-center space-y-6 md:space-y-8 animate-fade-in-up">        
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-secondary leading-tight text-balance">
          Smarter Hiring, <br />
          <span className="text-primary relative inline-block">
            Faster Decisions
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
               <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
            </svg>
          </span>
        </h1>
        
        <p className="text-base md:text-xl text-foreground/70 max-w-2xl leading-relaxed text-pretty">
          Transform how you evaluate candidates. Upload resumes and get detailed, AI-driven insights in seconds, not hours.
        </p>

        <div className="w-full flex justify-center mt-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-2xl px-2">
            <Link 
              href="/upload" 
              className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary/90 transition-[background-color,transform,shadow] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Start Evaluating Free
            </Link>

            {hasRecentResults && (
              <Link 
                href="/results/latest" 
                className="w-full sm:w-auto px-6 py-3 bg-white border border-primary text-primary rounded-full font-semibold text-sm hover:bg-primary/5 transition-[background-color,transform] text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                View Latest Results
              </Link>
            )}

            <Link 
              href="#how-it-works" 
              className="w-full sm:w-auto px-6 py-3 bg-transparent border border-foreground/10 text-secondary rounded-full font-semibold text-sm hover:bg-foreground/5 transition-[background-color,transform] text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
            >
              See How It Works
            </Link>
          </div>
        </div>

        {/* Minimal metrics */}
        <div className="pt-12 md:pt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 text-foreground/60 text-sm font-medium w-full max-w-3xl">
           <div className="flex flex-col items-center">
              <span className="block text-2xl md:text-3xl font-bold text-secondary mb-1">98%</span>
              Accuracy
           </div>
           <div className="flex flex-col items-center">
              <span className="block text-2xl md:text-3xl font-bold text-secondary mb-1">10x</span>
              Faster Screening
           </div>
           <div className="flex flex-col items-center">
              <span className="block text-2xl md:text-3xl font-bold text-secondary mb-1">24/7</span>
              Availability
           </div>
        </div>
      </div>
    </section>
  );
}
