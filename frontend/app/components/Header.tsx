
import Link from 'next/link';
import Logo from './Logo';

export default function Header() {
  return (
    <header className="w-full py-4 px-4 md:py-6 md:px-8 flex justify-between items-center bg-background/80 backdrop-blur-md sticky top-0 left-0 right-0 z-50 transition-all border-b border-transparent">
      <Link href="/">
        <Logo />
      </Link>
      
    

      <div className="flex items-center space-x-4">
        
        <Link 
          href="/upload" 
          className="bg-primary text-white px-5 py-2 rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
