'use client';

import React, { useState } from 'react';
import { DocsNavbar } from './DocsNavbar';
import { DocsSidebar } from './DocsSidebar';
import { LandingFooter as DocsFooter } from '../Marketing/LandingFooter'; // Reutilizamos el footer premium

export function DocsLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
      <DocsNavbar onMenuClick={() => setMobileMenuOpen(true)} />
      
      <div className="flex-1 max-w-7xl w-full mx-auto flex relative">
        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed md:sticky top-16 left-0 h-[calc(100vh-64px)] z-50 bg-white dark:bg-slate-950 transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <DocsSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 py-10 px-6 md:px-12 lg:px-20 max-w-4xl mx-auto">
          {children}
        </main>
      </div>

      <DocsFooter />
    </div>
  );
}
