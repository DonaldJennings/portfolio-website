'use client';

import React from 'react';

export default function AboutPage() {
  return (
    <div className="relative min-h-screen font-mono bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Me</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Passionate software engineer with a focus on innovation and excellence
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Introduction */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700">
              <h2 className="text-2xl font-semibold text-white mb-4">Introduction</h2>
              <div className="text-slate-300 space-y-4">
                <p>
                  Hello! I&apos;m Donald Jennings, a dedicated Software Engineer currently working
                  at Leonardo UK Ltd. With a BSc (Hons) in Computer Science and MIET certification,
                  I bring both academic knowledge and practical expertise to every project.
                </p>
                <p>
                  My passion lies in developing innovative solutions that bridge the gap between
                  complex technical challenges and user-friendly applications. I thrive in
                  environments where creativity meets cutting-edge technology.
                </p>
              </div>
            </div>

            {/* Experience */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700">
              <h2 className="text-2xl font-semibold text-white mb-6">Experience</h2>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-semibold text-white">Software Engineer</h3>
                  <p className="text-blue-400 font-medium">Leonardo UK Ltd</p>
                  <p className="text-slate-400 text-sm mb-2">2023 - Present</p>
                  <p className="text-slate-300">
                    Developing robust software solutions for complex engineering challenges. Working
                    with cutting-edge technologies to deliver high-quality applications that meet
                    stringent industry standards.
                  </p>
                </div>
              </div>
              <br></br>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-semibold text-white">Junior Software Engineer</h3>
                  <p className="text-blue-400 font-medium">Altra ERC</p>
                  <p className="text-slate-400 text-sm mb-2">2021 - 2022</p>
                  <p className="text-slate-300">
                    Junior software engineer focused on developing and maintaining web applications
                    and internal tools. Gained hands-on experience in full-stack development and
                    agile methodologies.
                  </p>
                </div>
              </div>
              <br></br>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-semibold text-white">
                    Software Quality Assurance Project Lead
                  </h3>
                  <p className="text-blue-400 font-medium">HYPED</p>
                  <p className="text-slate-400 text-sm mb-2">2020 - 2021</p>
                  <p className="text-slate-300">
                    Led a team in ensuring software quality through rigorous testing and validation
                    processes. Developed automated test suites and implemented best practices to
                    enhance product reliability and performance.
                  </p>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700">
              <h2 className="text-2xl font-semibold text-white mb-6">Education</h2>
              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-xl font-semibold text-white">BSc (Hons) Computer Science</h3>
                  <p className="text-slate-400 text-sm mb-2">University Degree</p>
                  <p className="text-slate-300">
                    Comprehensive study of computer science fundamentals including algorithms, data
                    structures, software engineering principles, and modern programming paradigms.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Skills */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700">
              <h2 className="text-2xl font-semibold text-white mb-6">Skills</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Programming Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {['C++', 'C', 'Python', 'Java', 'Haskell'].map(skill => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Frameworks & Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Next.js', 'Node.js', 'Git', 'Docker', 'Qt'].map(skill => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Software Engineering', 'System Design', 'Software Architecture'].map(
                      skill => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700">
              <h2 className="text-2xl font-semibold text-white mb-6">Certifications</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-300">MIET (Member of IET)</span>
                </div>
              </div>
            </div>

            {/* Interests */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700">
              <h2 className="text-2xl font-semibold text-white mb-6">Interests</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  <span className="text-slate-300">Emerging Technologies</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  <span className="text-slate-300">Open Source Projects</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  <span className="text-slate-300">Software Architecture</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  <span className="text-slate-300">Continuous Learning</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700">
            <h2 className="text-2xl font-semibold text-white mb-4">Let&apos;s Work Together</h2>
            <p className="text-slate-300 mb-6">
              Interested in collaborating on a project or discussing opportunities? I&apos;d love to
              hear from you!
            </p>
            <a
              href="/contact"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
