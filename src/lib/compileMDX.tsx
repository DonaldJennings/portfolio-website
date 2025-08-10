import { compile } from '@mdx-js/mdx';
import rehypePrettyCode from 'rehype-pretty-code';

export async function compileMdx(source: string) {
  const compiled = await compile(source, {
    outputFormat: 'function-body',
    rehypePlugins: [[rehypePrettyCode, { theme: 'github-dark', keepBackground: false }]],
  });
  return compiled.value;
}
