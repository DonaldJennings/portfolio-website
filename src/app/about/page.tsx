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
              bodyText="Hello! I'm Donald Jennings, a dedicated Software Engineer currently working at Leonardo UK Ltd. With a BSc (Hons) in Computer Science and MIET certification, I bring both academic knowledge and practical expertise to every project. My passion lies in developing innovative solutions that bridge the gap between complex technical challenges and user-friendly applications. I thrive in environments where creativity meets cutting-edge technology"
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
