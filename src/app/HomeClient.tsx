'use client';

import { useEffect, useState } from 'react';
import LandingPage from '@/components/pages/LandingPage';
import SectionWithBackground from '@/components/molecules/Section';
import ExperienceList from '@/components/organisms/ExperienceList';
import EducationSection from '@/components/organisms/EducationSection';
import PublicationsSection from '@/components/organisms/PublicationsSection';
import AboutSidebar from '@/components/organisms/AboutSidebar';
import CallToActionSection from '@/components/organisms/CallToActionSection';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import type { ExperienceEntry, EducationEntry, PublicationEntry } from '@/lib/admin/contentStore';

type HomeClientProps = {
  experience: ExperienceEntry[];
  education: EducationEntry[];
  publications: PublicationEntry[];
  isOpenForOpportunities: boolean;
};

const ABOUT_ITEMS = [
  { id: 'summary', label: 'Summary' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'publications', label: 'Publications' },
];

function AboutTOC() {
  const [active, setActive] = useState('summary');
  useEffect(() => {
    function onScroll() {
      let current = 'summary';
      for (const item of ABOUT_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            current = item.id;
          }
        }
      }
      setActive(current);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className="hidden lg:block lg:col-span-1 sticky top-32 self-start mr-2">
      <ul className="space-y-2 bg-slate-800/60 rounded-xl p-4 text-sm text-slate-200 shadow-md">
        {ABOUT_ITEMS.map(item => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={
                (active === item.id
                  ? 'text-green-400 font-semibold border-l-4 border-green-400 pl-2 bg-slate-700/40 '
                  : 'hover:text-green-400 transition-colors duration-150 pl-2') +
                ' block rounded-md py-1 px-1'
              }
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function HomeClient({
  experience,
  education,
  publications,
  isOpenForOpportunities,
}: HomeClientProps) {
  const isAboutVisible = useScrollAnimation();

  useEffect(() => {
    const scrollToSection = sessionStorage.getItem('scrollToSection');
    if (scrollToSection) {
      sessionStorage.removeItem('scrollToSection');
      setTimeout(() => {
        const element = document.getElementById(scrollToSection);
        if (element) {
          const navbarHeight = 80;
          const elementPosition = element.offsetTop - navbarHeight;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth',
          });
        }
      }, 100);
    }
  }, []);

  return (
    <main className="relative w-full font-mono">
      {/* Landing Section */}
      <section className="h-screen w-full overflow-hidden relative z-10">
        <LandingPage />
      </section>

      {/* About Section Divider & Cue */}
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
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          {/* Header */}
          <div
            className={`text-center mb-12 transition-all duration-1000 delay-200 ${
              isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Me</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Software Engineer with a focus on innovation and systems programming
            </p>
          </div>

          <div className="grid lg:grid-cols-6 gap-12">
            <AboutTOC />
            {/* Main Content */}
            <div
              className={`lg:col-span-4 space-y-8 transition-all duration-1000 delay-400 ${
                isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              id="summary"
            >
              {/* Introduction */}
              <SectionWithBackground
                title="Introduction"
                bodyText="Hello! I'm Donald, a Software Engineer currently working at Leonardo UK Ltd. I graduated with a 1st Class BSc (Hons) in Computer Science from University of Edinburgh. I am interested in developing innovative and smart solutions to complex technical challenges with my skills spanning a wide range from cloud computing to systems programming"
              />

              {/* Experience */}
              <div id="experience">
                <ExperienceList jobs={experience} />
              </div>

              {/* Education */}
              <div id="education">
                <EducationSection education={education} />
              </div>

              {/* Publications */}
              <div id="publications">
                <PublicationsSection publications={publications} />
              </div>
            </div>

            {/* Sidebar */}
            <div
              className={`lg:col-span-1 min-w-[260px] max-w-xs transition-all duration-1000 delay-600 ${
                isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <AboutSidebar />
            </div>
          </div>

          {/* Call to Action - Only show when open for opportunities */}
          {isOpenForOpportunities && (
            <div
              className={`mt-12 transition-all duration-1000 delay-800 ${
                isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <CallToActionSection />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
