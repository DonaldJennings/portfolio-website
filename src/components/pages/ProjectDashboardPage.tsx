'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { ProjectMeta } from '@/lib/projects';
import ProjectHeroStrip from '../organisms/ProjectHeroStrip';
import ProjectStatCards from '../organisms/ProjectStatCards';

type Tab = 'overview' | 'architecture' | 'notes';

type ProjectDashboardPageProps = {
  meta: ProjectMeta;
  children?: React.ReactNode;
};

export default function ProjectDashboardPage({ meta, children }: ProjectDashboardPageProps) {
  const hasArchitecture = Boolean(meta.architectureDiagram);
  const hasNotes = Boolean(children);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    ...(hasArchitecture ? [{ id: 'architecture' as Tab, label: 'Architecture' }] : []),
    ...(hasNotes ? [{ id: 'notes' as Tab, label: 'Technical Notes' }] : []),
  ];

  const [activeTab, setActiveTab] = useState<Tab>('overview');

  return (
    <div className="w-full space-y-5 py-6 px-4 md:px-8">
      <ProjectHeroStrip meta={meta} />
      <ProjectStatCards meta={meta} />

      {/* Tab panel */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'rgba(15,23,42,0.65)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1.5px solid rgba(59,130,246,0.15)',
        }}
      >
        {/* Tab bar */}
        <div className="flex border-b border-slate-700/60">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3.5 text-sm font-medium transition-all relative ${
                activeTab === tab.id
                  ? 'text-blue-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-teal-500" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-5 md:p-7">
          {activeTab === 'overview' && (
            <OverviewTab meta={meta} />
          )}
          {activeTab === 'architecture' && hasArchitecture && (
            <ArchitectureTab src={meta.architectureDiagram!} />
          )}
          {activeTab === 'notes' && hasNotes && (
            <NotesTab>{children}</NotesTab>
          )}
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ meta }: { meta: ProjectMeta }) {
  return (
    <div className="space-y-6">
      {/* Banner image */}
      {meta.image && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <Image src={meta.image} alt={meta.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 900px" />
        </div>
      )}

      {/* Problem */}
      {meta.problem && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-400 mb-2">Problem</h2>
          <p className="text-slate-300 leading-relaxed">{meta.problem}</p>
        </div>
      )}

      {/* Description fallback */}
      {!meta.problem && meta.description && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-400 mb-2">About</h2>
          <p className="text-slate-300 leading-relaxed">{meta.description}</p>
        </div>
      )}

      {/* Highlights */}
      {meta.highlights && meta.highlights.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-green-400 mb-3">Highlights</h2>
          <ul className="space-y-2">
            {meta.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2.5 text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Empty state */}
      {!meta.problem && !meta.description && (!meta.highlights || meta.highlights.length === 0) && !meta.image && (
        <p className="text-slate-500 text-sm">No overview content has been added yet.</p>
      )}
    </div>
  );
}

function ArchitectureTab({ src }: { src: string }) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">
        Diagram authored in draw.io. Scroll or pinch to zoom on mobile.
      </p>
      <div
        className="rounded-lg overflow-auto border border-slate-700/50"
        style={{ maxHeight: '65vh', background: 'rgba(255,255,255,0.03)' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Architecture diagram"
          className="max-w-none w-full"
          style={{ minWidth: 600 }}
        />
      </div>
    </div>
  );
}

function NotesTab({ children }: { children: React.ReactNode }) {
  return (
    <section className="mdx-content" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
      {children}
    </section>
  );
}
