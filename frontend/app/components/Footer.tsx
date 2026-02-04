import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="w-full bg-white/40 border-t border-secondary/10 py-10 md:py-12 mt-16 md:mt-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left: Brand Text */}
        <div className="flex-1 flex flex-col items-center md:items-start group">
          <Link href="/" className="font-bold text-xl tracking-tight text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">
             Skrut<span className="text-primary">.ai</span>
          </Link>
          <p className="text-[10px] text-muted mt-1 hidden md:block">
            Empowering hiring with AI.
          </p>
        </div>

        {/* Center: Copyright */}
        <div className="flex-1 text-center">
          <p className="text-[10px] text-muted uppercase tracking-widest tabular-nums">
            © {new Date().getFullYear()} Skrut AI. All rights reserved.
          </p>
        </div>

        {/* Right: Navigation Links */}
        <div className="flex-1 flex flex-wrap justify-center md:justify-end gap-6 text-[11px] font-bold text-secondary/60 uppercase tracking-wider">
          <Link href="/about" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">About</Link>
          <Link href="/privacy-policy" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">Privacy</Link>
          <Link href="/terms-of-service" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">Terms</Link>
          <Link href="/contact" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
