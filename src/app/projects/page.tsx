'use client';

import React from 'react';
import MatrixRain from '@/components/organisms/MatrixRain';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <MatrixRain />
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-12 border border-slate-800">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Projects
            </h1>
            <div className="flex items-center justify-center mb-6">
              <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mr-3"></div>
              <span className="text-yellow-400 font-medium">Under Construction</span>
            </div>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              This page is currently being developed. Check back soon to see my latest projects and
              portfolio pieces!
            </p>
            <p className="text-slate-400 text-sm">
              In the meantime, feel free to explore other sections of my portfolio or get in touch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
