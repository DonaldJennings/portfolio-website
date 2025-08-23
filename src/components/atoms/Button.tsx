import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'cta';
};

export default function Button({ children, variant = 'primary', ...props }: ButtonProps) {
  const base = 'px-4 py-2 rounded font-medium transition focus:outline-none';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-slate-700 text-slate-100 hover:bg-slate-800',
    cta: 'bg-gradient-to-r from-blue-600 via-teal-500 to-green-400 text-white shadow-lg hover:from-blue-500 hover:to-green-300 hover:scale-105 focus:ring-2 focus:ring-blue-400',
  };
  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}
