'use client';

import SectionWithBackground from '@/components/molecules/Section';
import ExperienceList from '@/components/organisms/ExperienceList';
import EducationSection from '@/components/organisms/EducationSection';
import AboutSidebar from '@/components/organisms/AboutSidebar';
import CallToActionSection from '@/components/organisms/CallToActionSection';
import React from 'react';

export default function AboutPage() {
  return (
    <div className="relative min-h-screen font-mono bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Me</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Passionate software engineer with a focus on innovation and excellence
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Introduction */}
            <SectionWithBackground
              title="Introduction"
              bodyText="Hello! I'm Donald, a Software Engineer currently working at Leonardo UK Ltd. I graduated with a 1st Class BSc (Hons) in Computer Science from University of Edinburgh. I am interested in developing innovative and smart solutions to complex technical challenges with my skills spanning a wide range from cloud computing to systems programming."
            />

            {/* Experience */}
            <ExperienceList />

            {/* Education */}
            <EducationSection />
          </div>

          {/* Sidebar */}
          <AboutSidebar />
        </div>

        {/* Call to Action */}
        <div className="mt-12">
          <CallToActionSection />
        </div>
      </div>
    </div>
  );
}
