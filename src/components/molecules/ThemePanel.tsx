'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/components/context/ThemeContext';
import { COLOR_SCHEMES, BACKDROPS } from '@/lib/themes';

export default function ThemePanel() {
  const [open, setOpen] = useState(false);
  const { colorScheme, backdropId, setColorScheme, setBackdropId } = useTheme();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Theme settings"
        className={`flex items-center justify-center w-9 h-9 rounded-md border transition-colors ${
          open
            ? 'border-slate-500 bg-slate-700/80 text-slate-200'
            : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:border-slate-500'
        }`}
      >
        {/* Sliders icon */}
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <line x1="2" y1="4" x2="13" y2="4" />
          <line x1="2" y1="7.5" x2="13" y2="7.5" />
          <line x1="2" y1="11" x2="13" y2="11" />
          <circle cx="5" cy="4" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="9.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="6.5" cy="11" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-52 bg-slate-900/96 border border-slate-700/80 rounded-lg shadow-2xl backdrop-blur-md z-50 overflow-hidden">
          <div className="px-3 py-2.5 border-b border-slate-700/60">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Appearance</p>
          </div>

          <div className="px-3 py-2.5 border-b border-slate-700/40">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Color Scheme</p>
            <div className="space-y-0.5">
              {COLOR_SCHEMES.map(scheme => (
                <button
                  key={scheme.id}
                  onClick={() => setColorScheme(scheme.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-sm transition-colors ${
                    colorScheme === scheme.id
                      ? 'bg-slate-700/80 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span>{scheme.name}</span>
                  {colorScheme === scheme.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="px-3 py-2.5">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Backdrop</p>
            <div className="space-y-0.5">
              {BACKDROPS.map(backdrop => (
                <button
                  key={backdrop.id}
                  onClick={() => setBackdropId(backdrop.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-sm transition-colors ${
                    backdropId === backdrop.id
                      ? 'bg-slate-700/80 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span>{backdrop.name}</span>
                  {backdropId === backdrop.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
