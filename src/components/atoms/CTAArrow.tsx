import React from 'react';

const CTAArrow: React.FC = () => (
  <span
    className="inline-block transition-transform duration-300 group-hover:translate-x-4 group-hover:scale-110"
    style={{ marginRight: '4px' }}
  >
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ verticalAlign: 'middle', transform: 'translateX(0)' }}
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="#3b82f6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

export default CTAArrow;
