"use client";

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] font-sans text-foreground transition-all duration-700">
      <Header />

      <main className="flex-grow pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-6xl w-full mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-secondary tracking-tighter">
              Let's <span className="text-primary italic">Connect.</span>
            </h1>
            <p className="text-lg text-foreground/50 max-w-xl mx-auto font-medium">
              Whether you're scaling a team or just have a quick question.
            </p>
          </div>

          {/* Social Cards */}
          <div className="relative group mx-auto max-w-5xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 rounded-[45px] blur-2xl opacity-50"></div>
            
            <div className="relative bg-white rounded-[40px] border border-secondary/5 shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-500 hover:shadow-[0_30px_70px_rgba(0,0,0,0.06)]">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-secondary/5">
                
                {/* Email Section */}
                <div className="p-10 md:p-14 flex flex-col items-center text-center space-y-6">
                  <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary transition-transform duration-500 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.2 8.4c.5.3.8.8.8 1.3v10c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V9.7c0-.5.3-1 .8-1.3l8-5c.7-.4 1.7-.4 2.4 0l8 5Z"/><path d="m22 9-8.4 5.2c-.4.3-1 .3-1.4 0L4 9"/></svg>
                  </div>
                  <div className="space-y-2 w-full">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Email</p>
                    <a href="mailto:p.indulakshana@gmail.com" className="text-[13px] sm:text-sm lg:text-base font-bold text-secondary hover:text-primary transition-colors block whitespace-nowrap">
                      p.indulakshana@gmail.com
                    </a>
                  </div>
                </div>

                {/* GitHub Section */}
                <div className="p-10 md:p-14 flex flex-col items-center text-center space-y-6 bg-gray-50/20">
                  <div className="w-16 h-16 bg-secondary/5 rounded-2xl flex items-center justify-center text-secondary transition-transform duration-500 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                  </div>
                  <div className="space-y-2 w-full text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">GitHub</p>
                    <a href="https://github.com/snui1s" target="_blank" rel="noopener noreferrer" className="text-base md:text-lg font-bold text-secondary hover:text-primary transition-colors block">
                      @snui1s
                    </a>
                  </div>
                </div>

                {/* Location Section */}
                <div className="p-10 md:p-14 flex flex-col items-center text-center space-y-6">
                  <div className="w-16 h-16 bg-secondary/5 rounded-2xl flex items-center justify-center text-secondary transition-transform duration-500 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div className="space-y-2 w-full text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Location</p>
                    <p className="text-base md:text-lg font-bold text-secondary">
                      Bangkok, <span className="text-secondary/40">TH</span>
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Minimalist Bento-style Automation Section */}
          <div className="max-w-6xl mx-auto mt-32 px-4 md:px-0">
            <div className="relative bg-white rounded-[50px] border border-secondary/5 p-8 md:p-16 overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.02)]">
              {/* Decorative soft glow */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px]"></div>
              
              <div className="relative z-10 space-y-16">
                {/* Header Area */}
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/5 rounded-full mb-6">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-secondary/50">Enterprise Solutions</span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-bold text-secondary tracking-tight leading-[1.1] mb-6">
                    On-premise <span className="text-primary italic">Integration.</span>
                  </h3>
                  <p className="text-base md:text-lg text-foreground/50 leading-relaxed font-medium">
                    Move beyond subscriptions. I specialize in deploying custom hiring infrastructure 
                    directly within your server environment for 100% data ownership and performance.
                  </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                  
                  {/* Left: Process Steps (01-04) */}
                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                    {[
                      { title: "Scrape", desc: "Automated extraction from recruitment sites & portals." },
                      { title: "Archive", desc: "Intelligent file organization on your private server." },
                      { title: "Analyze", desc: "Custom-tuned AI engine deployment for evaluation." },
                      { title: "Integrate", desc: "Seamless local workflow ownership for your HR team." }
                    ].map((step, i) => (
                      <div key={i} className="group/step">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-[11px] font-black text-primary bg-primary/5 w-8 h-8 rounded-lg flex items-center justify-center tracking-tighter">0{i + 1}</span>
                          <h4 className="text-[14px] font-black text-secondary uppercase tracking-widest">{step.title}</h4>
                        </div>
                        <p className="text-[13px] text-foreground/45 leading-relaxed font-medium pl-1 gap-2">
                          {step.desc}
                        </p>
                      </div>
                    ))}
                    
                    <div className="sm:col-span-2 pt-6">
                      <a 
                        href="mailto:p.indulakshana@gmail.com" 
                        className="inline-flex items-center gap-4 px-8 py-4 bg-secondary text-white rounded-2xl font-bold text-sm tracking-wide hover:bg-primary hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-secondary/10"
                      >
                        Enquire for Deployment
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                      </a>
                    </div>
                  </div>

                  {/* Right: Featured Implementation (GitHub/CPF) */}
                  <div className="lg:col-span-5 relative group/featured">
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-3xl blur opacity-50 group-hover/featured:opacity-100 transition duration-1000"></div>
                    <div className="relative h-full bg-[#fcfcfc] border border-secondary/5 p-8 rounded-3xl flex flex-col justify-between">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Featured Implementation</span>
                          <div className="text-secondary/20">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-lg font-bold text-secondary">Recruitment Site Scraper</h4>
                          <p className="text-sm text-foreground/50 leading-relaxed">
                            Implemented for <span className="text-secondary font-bold">CPF</span> to automate sourcing from <span className="text-secondary font-bold">leading recruitment platforms</span> using Playwright. 
                            I can extend this core logic to support any major job portals based on your enterprise needs. Feel free to integrate this yourself—just provide attribution.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {["Playwright", "Python", "Automation"].map((tag) => (
                            <span key={tag} className="text-[10px] font-black text-secondary/40 bg-secondary/[0.03] px-2 py-1 rounded-md border border-secondary/5">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-8 pt-6 border-t border-secondary/5">
                        <a 
                          href="https://github.com/snui1s/recruitment_site_scraper" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between group/link"
                        >
                          <span className="text-sm font-bold text-secondary group-hover/link:text-primary transition-colors italic decoration-primary/30 underline underline-offset-4">Explore Source Code</span>
                          <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center group-hover/link:bg-primary transition-colors">
                             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Minimalist Quote / Value Prop */}
                <div className="pt-8 text-center sm:text-left border-t border-secondary/5">
                  <p className="text-sm text-foreground/45 italic leading-relaxed max-w-2xl">
                    "I have previously implemented a focused automation pipeline for <span className="font-bold">CPF (Charoen Pokphand Foods)</span> that sources data from <span className="font-bold">major recruitment platforms</span> using <span className="font-bold">Playwright</span>. While the current implementation is portal-specific, I can customize and scale this architecture to support any other recruitment platforms depending on your project requirements, ensuring privacy, speed, and long-term sustainability."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="mt-24 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-secondary/5 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-bold text-secondary/60 uppercase tracking-wider">Online & Ready</span>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
