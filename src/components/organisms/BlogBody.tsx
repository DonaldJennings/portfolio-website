type BlogBodyProps = {
  children: React.ReactNode;
};

export default function BlogBody({ children }: BlogBodyProps) {
  return <section className="prose prose-invert max-w-none">{children}</section>;
}
