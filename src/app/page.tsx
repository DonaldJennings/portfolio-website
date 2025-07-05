// app/page.tsx
'use client';

import { useEffect } from 'react';
import LandingPage from '@/components/pages/LandingPage';
import SectionWithBackground from '@/components/molecules/Section';
import ExperienceList from '@/components/organisms/ExperienceList';
import EducationSection from '@/components/organisms/EducationSection';
import PublicationsSection from '@/components/organisms/PublicationsSection';
import AboutSidebar from '@/components/organisms/AboutSidebar';
import CallToActionSection from '@/components/organisms/CallToActionSection';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function Home() {
  const isAboutVisible = useScrollAnimation();

  // Set this to true when you're open for opportunities
  const isOpenForOpportunities = false; // Change to true when job searching

  // Handle scrolling to sections when navigating from other pages
  useEffect(() => {
    // Check if there's a stored scroll target from navigation
    const scrollToSection = sessionStorage.getItem('scrollToSection');
    if (scrollToSection) {
      sessionStorage.removeItem('scrollToSection');
      // Small delay to ensure page is fully loaded and elements are rendered
      setTimeout(() => {
        const element = document.getElementById(scrollToSection);
        if (element) {
          const navbarHeight = 80; // h-20 = 80px
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
    <main className="relative w-full bg-slate-900 font-mono">
      {/* Landing Section */}
      <section className="h-screen w-full overflow-hidden relative z-10">
        <LandingPage />
      </section>

      {/* About Section */}
      <section
        id="about"
        className={`min-h-screen w-full relative z-20 transition-all duration-1000 ${
          isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 20%, rgba(0,0,0,0.05) 40%, transparent 70%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          {/* Header */}
          <div
            className={`text-center mb-12 transition-all duration-1000 delay-200 ${
              isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Me</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Passionate software engineer with a focus on innovation and excellence
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div
              className={`lg:col-span-3 space-y-8 transition-all duration-1000 delay-400 ${
                isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              {/* Introduction */}
              <SectionWithBackground
                title="Introduction"
                bodyText="I'm Donald Jennings, a passionate Software Engineer currently working at Leonardo UK Ltd. I hold a BSc (Hons) in Computer Science and am a member of the Institution of Engineering and Technology (MIET). My expertise lies in developing innovative solutions that bridge the gap between complex technical challenges and real-world applications."
              />

              {/* Experience */}
              <ExperienceList />

              {/* Education */}
              <EducationSection />

              {/* Publications */}
              <PublicationsSection />
            </div>

            {/* Sidebar */}
            <div
              className={`transition-all duration-1000 delay-600 ${
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
