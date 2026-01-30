
import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="w-full bg-white/40 border-t border-secondary/10 py-12 mt-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Brand / Logo Area */}
        <div className="text-center md:text-left">
          <div className="mb-4 flex justify-center md:justify-start">
             <Logo />
          </div>
          <p className="text-sm text-muted max-w-xs">
            Empowering hiring teams with AI-driven resume analysis for faster, smarter decisions.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-8 text-sm font-medium text-foreground/80">
          <Link href="#" className="hover:text-primary transition-colors">About</Link>
          <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
        </div>

        {/* Socials / Copyright */}
        <div className="text-center md:text-right text-xs text-muted">
          <p>&copy; {new Date().getFullYear()} Critiq AI. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            {/* Placeholder Icons or Links */}

          </div>
        </div>

      </div>
    </footer>
  );
}
