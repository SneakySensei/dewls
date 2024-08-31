export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="h-full bg-neutral-100">{children}</div>;
}
