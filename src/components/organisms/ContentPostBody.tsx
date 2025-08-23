type BlogBodyProps = {
  children: React.ReactNode;
};

export default function ContentPostBody({ children }: BlogBodyProps) {
  return <section className="mdx-content">{children}</section>;
}
