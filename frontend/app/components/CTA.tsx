
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background with Gradient */}
      <div className="absolute inset-0 bg-primary/5 -z-10"></div>
      
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold text-secondary tracking-tight">
          Ready to hire <span className="text-primary">smarter?</span>
        </h2>
        <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed">
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
