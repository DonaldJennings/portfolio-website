'use client';

import { MDXProvider } from '@mdx-js/react';
import React from 'react';

const components = {
  h1: (props: React.ComponentPropsWithoutRef<'h1'>) => (
    <h1 className="text-4xl font-bold text-blue-300 mb-4" {...props} />
  ),
  h2: (props: React.ComponentPropsWithoutRef<'h2'>) => (
    <h2 className="text-3xl font-semibold text-blue-200 mt-8 mb-3" {...props} />
  ),
  h3: (props: React.ComponentPropsWithoutRef<'h3'>) => (
    <h3 className="text-2xl font-semibold text-blue-100 mt-6 mb-2" {...props} />
  ),
  ul: (props: React.ComponentPropsWithoutRef<'ul'>) => (
    <ul className="list-disc ml-6 mb-4" {...props} />
  ),
  li: (props: React.ComponentPropsWithoutRef<'li'>) => <li className="mb-2" {...props} />,
  p: (props: React.ComponentPropsWithoutRef<'p'>) => (
    <p className="mb-4 text-slate-200" {...props} />
  ),
  code: (props: React.ComponentPropsWithoutRef<'code'>) => (
    <code className="bg-slate-900 px-2 py-1 rounded text-sm" {...props} />
  ),
  pre: (props: React.ComponentPropsWithoutRef<'pre'>) => (
    <pre className="bg-slate-900 p-4 rounded mb-4 overflow-x-auto" {...props} />
  ),
};

type MDXContentProps = {
  children: React.ReactNode;
};

export default function MDXContent({ children }: MDXContentProps) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
