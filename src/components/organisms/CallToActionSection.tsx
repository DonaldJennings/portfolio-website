import React from 'react';

export default function CallToActionSection() {
  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-8 border border-slate-800 text-center">
      <h2 className="text-2xl font-semibold text-white mb-4">Let&apos;s Work Together</h2>
      <p className="text-slate-300 mb-6">
        Interested in collaborating on a project or discussing opportunities? I&apos;d love to hear
        from you!
      </p>
      <a
        href="/contact"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
      >
        Get In Touch
      </a>
    </div>
  );
}
