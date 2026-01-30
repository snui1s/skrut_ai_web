
export default function WavyDivider({ variant = 1 }: { variant?: 1 | 2 | 3 }) {
  const paths = {
    // 1. Classic Wave (Original)
    1: "M0,12 C150,24 350,0 600,12 C850,24 1050,0 1200,12",
    // 2. Gentle Long Flow
    2: "M0,6 C300,18 900,-6 1200,6",
    // 3. Deep Swell
    3: "M0,18 C200,6 400,30 600,18 C800,6 1000,30 1200,18"
  };

  return (
    <div className="w-full h-12 flex items-center justify-center my-4 overflow-hidden opacity-60">
        <svg viewBox="0 0 1200 24" preserveAspectRatio="none" className="w-full h-full text-primary fill-none stroke-current">
            <path d={paths[variant]} strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    </div>
  );
}
