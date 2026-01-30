
"use client";
import React, { useState } from 'react';

const faqs = [
  {
    question: "Is my data secure?",
    answer: "Absolutely. We process resumes specifically for analysis and do not share candidate data with third parties. Your privacy is our priority."
  },
  {
    question: "Does it support Thai Language?",
    answer: "Yes! Our Hybrid OCR and AI models are optimized to read and analyze Thai resumes accurately, including mixed English-Thai documents."
  },
  {
    question: "How accurate is the AI?",
    answer: "Unlike standard AI that hallucinates, our Agentic Workflow uses a multi-step verification process (Reviewer + Auditor) to ensure facts are grounded in the document."
  },
  {
    question: "Can I try it for free?",
    answer: "Yes, you can start evaluating candidates immediately with our free tier. No credit card required."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-secondary tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-muted text-lg">
            Everything you need to know about Skrut AI.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-secondary/10 rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/20"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className={`font-semibold text-lg ${openIndex === index ? 'text-primary' : 'text-secondary'}`}>
                  {faq.question}
                </span>
                <span className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-primary' : 'text-secondary/50'}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
              
              <div 
                className={`grid transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'grid-rows-[1fr] opacity-100 pb-6 pointer-events-auto' : 'grid-rows-[0fr] opacity-0 pb-0 pointer-events-none'
                }`}
              >
                <div className="overflow-hidden px-6">
                   <p className="text-muted leading-relaxed">
                     {faq.answer}
                   </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
