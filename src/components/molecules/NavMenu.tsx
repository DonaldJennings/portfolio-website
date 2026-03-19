// components/molecules/NavMenu.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import NavLink from '@/components/atoms/NavLink';

const adminLinks = [
  { name: 'Blog Posts',    href: '/admin/posts',        icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-6-4h6' },
  { name: 'Projects',      href: '/admin/projects',     icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  { name: 'Experience',    href: '/admin/experience',   icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { name: 'Education',     href: '/admin/education',    icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
  { name: 'Publications',  href: '/admin/publications', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { name: 'GitHub',        href: '/admin/github',       icon: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22' },
];

const links = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/', scrollTo: 'about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Developer Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export default function NavMenu({ vertical }: { vertical?: boolean }) {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await fetch('/api/admin/content');
        if (res.ok) setIsAdmin(true);
      } catch {
        // ignore
      }
    }

    void checkAdmin();
  }, []);

  return (
    <div className={vertical ? 'flex flex-col space-y-3' : 'flex space-x-4'}>
      {links.map(link => {
        // Handle active state for about section when on home page
        const isActive = pathname === link.href || (link.scrollTo === 'about' && pathname === '/');

        const handleLinkClick = (e: React.MouseEvent) => {
          if (link.scrollTo) {
            // If we're already on the home page, just scroll
            if (pathname === '/') {
              e.preventDefault();
              const element = document.getElementById(link.scrollTo);
              if (element) {
                const navbarHeight = 80; // h-20 = 80px
                const elementPosition = element.offsetTop - navbarHeight;
                window.scrollTo({
                  top: elementPosition,
                  behavior: 'smooth',
                });
              }
            } else {
              // If we're on a different page, store the scroll target
              sessionStorage.setItem('scrollToSection', link.scrollTo);
            }
          }
        };

        return (
          <NavLink
            key={link.name}
            href={link.href}
            className={
              vertical
                ? 'block py-3 px-4 text-lg font-medium text-center border-b border-slate-800 last:border-b-0 hover:bg-slate-700/50 transition-all'
                : 'px-2 py-1 transition-colors'
            }
            isActive={isActive}
            onClick={handleLinkClick}
          >
            {link.name}
          </NavLink>
        );
      })}

      {isAdmin && (
        <>
          <div className={vertical ? 'border-t border-slate-700/60 my-1' : 'w-px h-5 bg-slate-600/60 self-center mx-1'} />

          {vertical ? (
            /* Mobile: flat list of admin links */
            <>
              {adminLinks.map(link => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  className="block py-3 px-4 text-lg font-medium text-center border-b border-slate-800 last:border-b-0 hover:bg-slate-700/50 transition-all"
                  isActive={pathname === link.href}
                >
                  {link.name}
                </NavLink>
              ))}
            </>
          ) : (
            /* Desktop: hover dropdown */
            <div className="relative group/admin">
              <button
                className={`px-2 py-1 font-medium transition-colors relative ${
                  pathname.startsWith('/admin') ? 'text-white font-semibold' : 'text-slate-300 hover:text-green-400'
                }`}
              >
                <span className="relative flex items-center gap-1">
                  Admin
                  <svg className="w-3 h-3 opacity-60 transition-transform group-hover/admin:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="absolute left-0 -bottom-0.5 w-full h-[2px] bg-green-400 scale-x-0 group-hover/admin:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                </span>
              </button>

              {/* Dropdown panel */}
              <div className="absolute right-0 top-full pt-3 opacity-0 pointer-events-none group-hover/admin:opacity-100 group-hover/admin:pointer-events-auto transition-opacity duration-150 z-50">
                <div
                  className="w-44 rounded-xl py-1.5 overflow-hidden"
                  style={{
                    background: 'rgba(15,23,42,0.97)',
                    border: '1px solid rgba(59,130,246,0.18)',
                    boxShadow: '0 16px 48px 0 rgba(0,0,0,0.5)',
                  }}
                >
                  {adminLinks.map(link => (
                    <a
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${
                        pathname === link.href || pathname.startsWith(link.href + '/')
                          ? 'text-blue-300 bg-blue-600/10'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5 shrink-0 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                      </svg>
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
