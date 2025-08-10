type BlogBodyProps = {
  children: React.ReactNode;
};

export default function BlogBody({ children }: BlogBodyProps) {
  return <section className="mdx-content">{children}</section>;
}
