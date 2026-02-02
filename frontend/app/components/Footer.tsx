import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="w-full bg-white/40 border-t border-secondary/10 py-12 mt-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left: Logo Area */}
        <div className="flex-1 flex flex-col items-center md:items-start">
          <Logo />
          <p className="text-[10px] text-muted mt-2 hidden md:block">
            Empowering hiring with AI.
          </p>
        </div>

        {/* Center: Copyright */}
        <div className="flex-1 text-center">
          <p className="text-[10px] text-muted uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Skrut AI. All rights reserved.
          </p>
        </div>

        {/* Right: Navigation Links */}
        <div className="flex-1 flex flex-wrap justify-center md:justify-end gap-6 text-[11px] font-bold text-secondary/60 uppercase tracking-wider">
          <Link href="/about" className="hover:text-primary transition-colors">About</Link>
          <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy</Link>
          <Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
