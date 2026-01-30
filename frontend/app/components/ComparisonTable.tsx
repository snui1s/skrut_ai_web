
export default function ComparisonTable() {
  return (
    <section className="py-24 px-4 bg-background border-t border-secondary/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-secondary tracking-tight">
            Why Agentic Workflow?
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Standard AI often hallucinates. We built a multi-agent system to fix that.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-secondary/10 shadow-sm bg-white/50 backdrop-blur-sm">
          <div className="grid grid-cols-3">
            {/* Header Row */}
            <div className="p-6 bg-secondary/5 border-b border-r border-secondary/10 flex flex-col items-center justify-center">
               <span className="font-semibold text-secondary/60">Comparison</span>
            </div>
            <div className="p-6 bg-red-50/50 border-b border-r border-secondary/10 flex flex-col items-center justify-center text-center">
              <h3 className="text-xl font-bold text-red-600/80">Normal AI</h3>
            </div>
            <div className="p-6 bg-primary/10 border-b border-secondary/10 flex flex-col items-center justify-center text-center">
              <h3 className="text-xl font-bold text-primary">Our Agent System</h3>
            </div>

            {/* Row 1: Accuracy */}
            <div className="p-6 border-b border-r border-secondary/10 flex flex-col justify-center font-medium text-secondary">
              Accuracy
            </div>
            <div className="p-6 border-b border-r border-secondary/10 flex flex-col items-center justify-center text-center text-muted">
              Can make mistakes or invent facts.
            </div>
            <div className="p-6 border-b border-secondary/10 flex flex-col items-center justify-center text-center font-medium text-foreground bg-primary/5">
              <p><span className="text-primary font-bold">Verified.</span> We double-check everything.</p>
            </div>

            {/* Row 2: Bias */}
            <div className="p-6 border-b border-r border-secondary/10 flex flex-col justify-center font-medium text-secondary">
               Bias
            </div>
            <div className="p-6 border-b border-r border-secondary/10 flex flex-col items-center justify-center text-center text-muted">
              Often says what you want to hear.
            </div>
            <div className="p-6 border-b border-secondary/10 flex flex-col items-center justify-center text-center font-medium text-foreground bg-primary/5">
              <p><span className="text-primary font-bold">Neutral.</span> Based only on the resume facts.</p>
            </div>

             {/* Row 3: Depth */}
             <div className="p-6 border-r border-secondary/10 flex flex-col justify-center font-medium text-secondary">
               Depth
            </div>
            <div className="p-6 border-r border-secondary/10 flex flex-col items-center justify-center text-center text-muted">
               Matches only simple keywords.
            </div>
            <div className="p-6 border-secondary/10 flex flex-col items-center justify-center text-center font-medium text-foreground bg-primary/5">
               <p><span className="text-primary font-bold">Deep.</span> Understands the full career path.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
