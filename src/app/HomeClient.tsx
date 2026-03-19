'use client';

import { useEffect, useState } from 'react';
import LandingPage from '@/components/pages/LandingPage';
import ExperienceList from '@/components/organisms/ExperienceList';
import EducationSection from '@/components/organisms/EducationSection';
import PublicationsSection from '@/components/organisms/PublicationsSection';
import SkillsSection from '@/components/organisms/SkillsSection';
import CertificationsSection from '@/components/organisms/CertificationsSection';
import AwardsSection from '@/components/organisms/AwardsSection';
import InterestsSection from '@/components/organisms/InterestsSection';
import CallToActionSection from '@/components/organisms/CallToActionSection';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import type { ExperienceEntry, EducationEntry, PublicationEntry, ProfileData, HighlightEntry, SkillCategoryEntry, AwardEntry, InterestEntry } from '@/lib/admin/contentStore';

type Tab = 'experience' | 'education' | 'publications';

type HomeClientProps = {
  experience: ExperienceEntry[];
  education: EducationEntry[];
  publications: PublicationEntry[];
  profile: ProfileData;
  highlights: HighlightEntry[];
  skillCategories: SkillCategoryEntry[];
  certifications: string[];
  awards: AwardEntry[];
  interests: InterestEntry[];
  isOpenForOpportunities: boolean;
};

export default function HomeClient({
  experience,
  education,
  publications,
  profile,
  highlights,
  skillCategories,
  certifications,
  awards,
  interests,
  isOpenForOpportunities,
}: HomeClientProps) {
  const isAboutVisible = useScrollAnimation();
  const [activeTab, setActiveTab] = useState<Tab>('experience');

  useEffect(() => {
    const scrollToSection = sessionStorage.getItem('scrollToSection');
    if (scrollToSection) {
      sessionStorage.removeItem('scrollToSection');
      setTimeout(() => {
        const element = document.getElementById(scrollToSection);
        if (element) {
          const navbarHeight = 80;
          const elementPosition = element.offsetTop - navbarHeight;
          window.scrollTo({ top: elementPosition, behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    ...(publications.length > 0 ? [{ id: 'publications' as Tab, label: 'Publications' }] : []),
  ];

  const panelStyle = {
    background: 'rgba(15,23,42,0.68)',
    backdropFilter: 'blur(14px)',
    border: '1.5px solid rgba(100,116,139,0.22)',
  };

  return (
    <main className="relative w-full font-mono">
      {/* Landing Section */}
      <section className="h-screen w-full overflow-hidden relative z-10">
        <LandingPage />
      </section>

      {/* Scroll cue */}
      <div className="flex flex-col items-center justify-center mt-[-2rem] mb-4">
        <div className="w-24 h-1 bg-gradient-to-r from-green-400/0 via-green-400/80 to-green-400/0 rounded-full mb-2" />
        <div
          className="text-green-400 text-sm animate-bounce-slow select-none"
          style={{ animationDelay: '0.2s' }}
        >
          ↓ About Me
        </div>
      </div>

      <section
        id="about"
        className={`min-h-screen w-full relative z-20 transition-all duration-1000 ${
          isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-20 pb-24">
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* ── LEFT SIDEBAR (sticky) ── */}
            <aside
              className={`w-full lg:w-72 xl:w-80 lg:flex-shrink-0 lg:sticky lg:top-24 space-y-5 transition-all duration-1000 delay-200 ${
                isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {/* Bio card */}
              <div className="rounded-2xl p-6" style={panelStyle}>
                {/* Avatar + name */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%)' }}
                  >
                    {profile.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                    ) : (
                      profile.name?.charAt(0)?.toUpperCase() ?? 'D'
                    )}
                  </div>
                  <div>
                    <h1 className="text-white font-bold text-lg leading-tight">{profile.name}</h1>
                    <p className="text-teal-400 text-xs font-medium">{profile.role}</p>
                  </div>
                </div>

                <p className="text-slate-500 text-xs mb-3">{profile.company} · {profile.location}</p>

                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {profile.bio}
                </p>

                {/* Status badge */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  {profile.statusLabel}
                </span>
              </div>

              {/* Quick highlights */}
              <div className="rounded-2xl p-5 space-y-2" style={panelStyle}>
                {highlights.map(h => (
                  <HighlightRow key={h.label} icon={h.icon} label={h.label} sub={h.sub} />
                ))}
              </div>

              {/* Skills */}
              <div className="rounded-2xl p-5" style={panelStyle}>
                <SkillsSection categories={skillCategories} />
              </div>

              {/* Interests */}
              <div className="rounded-2xl p-5" style={panelStyle}>
                <InterestsSection interests={interests} />
              </div>
            </aside>

            {/* ── RIGHT MAIN PANEL (tabs) ── */}
            <div
              className={`flex-1 min-w-0 transition-all duration-1000 delay-400 ${
                isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {/* Tab panel */}
              <div className="rounded-2xl overflow-hidden" style={panelStyle}>
                {/* Tab bar */}
                <div className="flex border-b border-slate-700/60 overflow-x-auto">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all relative flex-shrink-0 ${
                        activeTab === tab.id
                          ? 'text-teal-400'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="p-6 md:p-8">
                  {activeTab === 'experience' && <ExperienceList jobs={experience} />}
                  {activeTab === 'education' && <EducationSection education={education} />}
                  {activeTab === 'publications' && <PublicationsSection publications={publications} />}
                </div>
              </div>

              {/* Awards — below the tab panel, always visible */}
              <div className="rounded-2xl p-6 md:p-8 mt-6" style={panelStyle}>
                <AwardsSection awards={awards} />
              </div>

              {/* Certifications — compact row below awards */}
              <div className="rounded-2xl p-6 mt-6" style={panelStyle}>
                <CertificationsSection certifications={certifications} />
              </div>

              {isOpenForOpportunities && (
                <div className="mt-6">
                  <CallToActionSection />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function HighlightRow({ icon, label, sub }: { icon: string; label: string; sub: string }) {
  return (
    <div className="flex items-start gap-2.5 py-1.5 border-b border-slate-700/40 last:border-0">
      <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className="text-slate-200 text-xs font-medium leading-snug">{label}</p>
        <p className="text-slate-500 text-[11px]">{sub}</p>
      </div>
    </div>
  );
}
