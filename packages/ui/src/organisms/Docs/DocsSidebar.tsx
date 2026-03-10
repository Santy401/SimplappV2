'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../utils/utils';

interface NavGroup {
  title: string;
  items: { title: string; href: string }[];
}

const DOCS_NAV: NavGroup[] = [
  {
    title: "Primeros Pasos",
    items: [
      { title: "Introducción", href: "/docs" },
      { title: "Instalación", href: "/docs/installation" },
      { title: "Onboarding", href: "/docs/onboarding" },
    ]
  },
  {
    title: "Core Features",
    items: [
      { title: "Facturación Electrónica", href: "/docs/billing" },
      { title: "Inventarios", href: "/docs/inventory" },
      { title: "Dashboard Modular", href: "/docs/dashboard" },
    ]
  },
  {
    title: "Avanzado",
    items: [
      { title: "Multi-tenant", href: "/docs/multi-tenant" },
      { title: "Integración API", href: "/docs/api" },
    ]
  }
];

export function DocsSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={cn("w-64 shrink-0 px-4 py-8 overflow-y-auto hidden md:block border-r border-slate-200 dark:border-slate-800", className)}>
      <nav className="space-y-8">
        {DOCS_NAV.map((group, idx) => (
          <div key={idx}>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-3 px-2">
              {group.title}
            </h4>
            <div className="space-y-1">
              {group.items.map((item, itemIdx) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={itemIdx}
                    href={item.href}
                    className={cn(
                      "block px-2 py-1.5 text-sm font-medium rounded-lg transition-colors",
                      isActive 
                        ? "text-[#6C47FF] bg-purple-50 dark:bg-purple-900/10" 
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900"
                    )}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
