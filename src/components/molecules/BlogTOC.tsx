import React, { useState } from 'react';

export type TOCItem = {
  id: string;
  text: string;
  level: number;
};

export default function BlogTOC({ toc }: { toc: TOCItem[] }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <nav
      className={`hidden lg:block sticky top-24 h-fit max-w-xs mr-8 bg-slate-900/80 rounded-xl border border-slate-800 shadow-md p-4 transition-all z-30`}
      style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
    >
      <button
        className="mb-4 text-xs text-slate-400 hover:text-teal-400 transition font-semibold"
        onClick={() => setCollapsed(c => !c)}
        aria-label={collapsed ? 'Expand Table of Contents' : 'Collapse Table of Contents'}
      >
        {collapsed ? 'Show Table of Contents' : 'Hide Table of Contents'}
      </button>
      {!collapsed && (
        <ul className="space-y-2">
          {toc.map(item => (
            <li key={item.id} className={`pl-${(item.level - 1) * 4}`}>
              <a
                href={`#${item.id}`}
                className="text-slate-300 hover:text-teal-400 text-sm block transition-all"
                style={{ fontWeight: item.level === 1 ? 'bold' : 'normal' }}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
