import { compileMDX } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';

export async function compileMdx(source: string) {
  const { content } = await compileMDX({
    source,
    options: {
      mdxOptions: {
        rehypePlugins: [[rehypePrettyCode, { theme: 'github-dark', keepBackground: false }]],
      },
    },
  });
  return content;
}
