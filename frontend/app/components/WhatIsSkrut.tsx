
import React from 'react';

export default function WhatIsSkrut() {
  return (
    <section className="py-16 px-4 md:py-24 md:px-6 bg-background border-t border-b border-secondary/5">
      <div className="max-w-5xl mx-auto">
        
        {/* Intro */}
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto space-y-4 md:space-y-6">
          <div className="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs md:text-sm mb-4 md:mb-6">
            The Problem vs The Solution
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-secondary tracking-tight">
            What is Skrut AI?
          </h2>
          <p className="text-base md:text-lg text-muted leading-relaxed">
            Screening hundreds of resumes manually takes forever. 
            Skrut AI solves this by using <span className="text-secondary font-semibold">Autonomous Agents</span> to do the work for you.
          </p>
        </div>

        {/* The Dual Agent System */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Reviewer Card */}
          <div className="p-8 rounded-3xl bg-background border border-secondary/10 hover:border-primary/20 transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
               {/* Search/Eye Icon */}
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <h3 className="text-2xl font-bold text-secondary mb-3">1. The Reviewer</h3>
            <p className="text-muted leading-relaxed">
              Reads every resume and checks if it matches your Job Description. It works fast to find the right skills.
            </p>
          </div>

          {/* Auditor Card */}
          <div className="p-8 rounded-3xl bg-background border border-secondary/10 hover:border-primary/20 transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-primary">
               {/* Shield/Check Icon */}
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <h3 className="text-2xl font-bold text-secondary mb-3">2. The Auditor</h3>
            <p className="text-muted leading-relaxed">
              Double-checks the Reviewer. It ensures the results are true and not "hallucinated" or over-hyped.
            </p>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="mt-12 text-center">
             <p className="text-xl font-medium text-secondary">
                Result: <span className="text-primary">Save hours of screening time</span> and get accurate shortlists.
             </p>
        </div>

      </div>
    </section>
  );
}
