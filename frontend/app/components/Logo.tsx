
import React from 'react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2.5 group cursor-pointer">
      {/* Logomark - No Background */}
      <div className="relative flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
         {/* Spark / Star Icon */}
         <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
         </svg>
      </div>

      {/* Logotype */}
      <div className="font-bold text-xl tracking-tight text-secondary">
        Skrut<span className="text-primary">.ai</span>
      </div>
    </div>
  );
}
