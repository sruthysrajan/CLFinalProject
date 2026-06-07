export function PageContainer({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="min-h-[calc(100dvh-73px)] px-5 pb-[calc(env(safe-area-inset-bottom)+6.75rem)] pt-6">
      {children}
    </main>
  );
}
