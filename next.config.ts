import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  outputFileTracingIncludes: {
    '/blog': ['./src/content/dev-blog/**/*.mdx', './src/data/*.json'],
    '/blog/[slug]': ['./src/content/dev-blog/**/*.mdx', './src/data/*.json'],
    '/projects': ['./src/content/projects/**/*.mdx', './src/data/*.json'],
    '/projects/[slug]': ['./src/content/projects/**/*.mdx', './src/data/*.json'],
  },
};

export default nextConfig;
