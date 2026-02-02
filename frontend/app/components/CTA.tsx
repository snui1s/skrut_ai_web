
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-16 px-4 md:py-24 md:px-6 relative overflow-hidden bg-background">
      <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8 relative z-10">
        <h2 className="text-3xl md:text-6xl font-bold text-secondary tracking-tight">
          Ready to hire <span className="text-primary">smarter?</span>
        </h2>
        <p className="text-base md:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
          Join forward-thinking HR teams using Agentic AI to find the perfect candidates without the bias.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            href="/upload" 
            className="px-10 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-opacity-90 transition-all shadow-xl shadow-primary/20 hover:transform hover:-translate-y-1"
          >
            Start Evaluating Free
          </Link>

        </div>
    
      </div>
    </section>
  );
}
