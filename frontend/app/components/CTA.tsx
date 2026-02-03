
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-24 px-4 md:py-32 md:px-6 relative overflow-hidden bg-background">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 animate-pulse"></div>

      <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-10 relative z-10">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-6xl font-black text-secondary tracking-tighter text-balance">
            Ready to hire <span className="text-primary relative inline-block">
              smarter?
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-20" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted/80 max-w-2xl mx-auto leading-relaxed text-pretty font-medium">
            Join forward-thinking HR teams using Agentic AI to find the perfect candidates without the bias.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link 
            href="/upload" 
            className="group relative inline-flex items-center justify-center px-10 py-5 bg-primary text-white rounded-full font-bold text-lg overflow-hidden transition-all duration-300 hover:bg-primary/90 shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            
            <span className="relative z-10 flex items-center gap-2">
              Start Evaluating Free
              <svg 
                className="w-5 h-5 transition-transform duration-300 transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
        </div>
    
        <p className="text-sm text-muted/50 font-medium">
           No credit card required. Delete your data anytime.
        </p>

      </div>
    </section>
  );
}
