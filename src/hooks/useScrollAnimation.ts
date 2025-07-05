'use client';

import { useEffect, useState } from 'react';

export const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Trigger animation when about section is 20% visible
        if (rect.top < windowHeight * 0.8) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Check initial state
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isVisible;
};
