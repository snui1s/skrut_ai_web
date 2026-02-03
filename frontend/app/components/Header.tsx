'use client';

import Link from 'next/link';
import Logo from './Logo';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const isUploadPage = pathname === '/upload';

  return (
    <header className="w-full py-4 px-4 md:py-6 md:px-8 flex justify-between items-center bg-background/80 backdrop-blur-md sticky top-0 left-0 right-0 z-50 transition-[background-color,border-color,backdrop-filter] border-b border-transparent">
      <Link href="/" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg transition-shadow">
        <Logo />
      </Link>
      
    
      <div className="flex items-center space-x-6">
        {/* Navigation Links - Subtle */}
        <nav className="hidden md:flex items-center space-x-8 text-[13px] font-bold text-secondary/60 uppercase tracking-widest">
           <Link href="/about" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">About</Link>
           <Link href="/contact" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">Contact</Link>
        </nav>

        {!isUploadPage && (
          <Link 
            href="/upload" 
            className="group relative inline-flex items-center justify-center px-3.5 py-2 md:px-6 md:py-2.5 overflow-hidden font-bold text-primary transition-all duration-300 bg-primary/5 rounded-full border border-primary/20 hover:bg-primary hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <span className="text-[12px] md:text-sm">Get Started</span>
            <svg 
              className="w-3.5 h-3.5 md:w-4 md:h-4 ml-1.5 md:ml-2 transition-transform duration-300 transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        )}
      </div>
    </header>
  );
}
