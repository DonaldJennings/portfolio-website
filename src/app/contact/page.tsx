'use client';

import React from 'react';
import MatrixRain from '@/components/organisms/MatrixRain';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <MatrixRain />
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-12 border border-slate-800">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Contact
            </h1>
            <div className="flex items-center justify-center mb-6">
              <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mr-3"></div>
              <span className="text-yellow-400 font-medium">Under Construction</span>
            </div>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              This page is currently being developed. Check back soon for contact forms and ways to
              get in touch!
            </p>
            <p className="text-slate-400 text-sm mb-6">
              In the meantime, feel free to explore other sections of my portfolio.
            </p>
            <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
              <p className="text-slate-300 mb-4">You can connect with me on:</p>
              <a
                href="https://www.linkedin.com/in/donald-jennings-675081191/?originalSubdomain=uk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Donald Jennings - LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
