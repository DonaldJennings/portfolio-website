import React from 'react';
import { Metadata } from 'next';
import ContactPageContent from '@/components/pages/ContactPageContent';

export const metadata: Metadata = {
  title: 'Contact | Donald Jennings',
  description:
    'Get in touch with me for collaboration opportunities, consulting, or just to say hello.',
};

const ContactPage = () => {
  return <ContactPageContent />;
};

export default ContactPage;
