
export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Hybrid OCR",
      description: "We extract text from your PDF or image files accurately.",
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-primary">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" className="text-secondary "/>
          <path d="M10 8h4" />
          <path d="M10 12h4" />
          <path d="M10 16h4" />
          <path d="M10 8V2" stroke="none"/>
        </svg>
      )
    },
    {
      id: 2,
      title: "Expert Review",
      description: "AI checks skills and experience against the job description.",
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-primary">
           <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" className="text-secondary"/>
           <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" className="text-secondary"/>
           <path d="M12 12h.1" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Fact-Check Audit",
      description: "We double-check the results to ensure they are real.",
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-primary">
           <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="text-secondary"/>
           <path d="M9 12l2 2 4-4" strokeWidth="2" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Final Verdict",
      description: "Get a clear score and summary you can trust.",
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-primary">
           <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" className="text-secondary"/>
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 px-4 md:py-24 md:px-6 relative overflow-hidden bg-background" id="how-it-works">
      
      <div className="max-w-7xl mx-auto z-10 relative">
        <div className="text-center mb-12 md:mb-16 space-y-3 md:space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-secondary tracking-tight">
            How It Works
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-base md:text-lg">
             Simple steps to get accurate results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative items-start">
          
          {steps.map((step, index) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center text-center group">
              
              {/* Icon Container - Standardized for all steps */}
              <div className="w-24 h-24 mb-6 relative flex items-center justify-center transition-all duration-500 group-hover:translate-y-[-5px]">
                <div className="absolute inset-0 bg-white rounded-2xl border border-secondary/10 shadow-sm transform rotate-3 transition-transform group-hover:rotate-6"></div>
                
                <div className="relative z-10 w-full h-full p-6">
                  {step.svg}
                </div>
              </div>


              
              {/* Text */}
              <h3 className="text-xl font-bold mb-3 text-secondary">
                {step.id}. {step.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed max-w-[200px] mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
