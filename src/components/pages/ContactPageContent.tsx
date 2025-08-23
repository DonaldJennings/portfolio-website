'use client';

import React from 'react';
import Icon from '@/components/atoms/Icon';
import PageHeader from '../atoms/PageHeader';
import ContactForm from '../molecules/ContactForm';

export default function ContactPageContent() {
  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-24 pb-16">
        <PageHeader
          title="Let's connect"
          subtitle="Get in touch with me."
          align="center"
          className="mb-8 pt-8 pb-4 text-center"
        />

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Get In Touch
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Whether you have a project in mind, want to discuss potential collaborations, or
                simply want to connect, I&apos;d love to hear from you.
              </p>
            </div>

            {/* Social Media Links */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Connect on Social
              </h3>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/DonaldJennings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12  dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors duration-200"
                  aria-label="GitHub"
                >
                  <Icon name="github" className="w-6 h-6" />
                </a>
                <a
                  href="https://www.linkedin.com/in/donald-jennings-675081191/?originalSubdomain=uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <Icon name="linkedin" className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-8 border border-slate-800">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Send a Message
            </h3>

            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
