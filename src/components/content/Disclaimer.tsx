type DisclaimerProps = {
  children: React.ReactNode;
};

export function Disclaimer({ children }: Readonly<DisclaimerProps>) {
  return (
    <aside className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm leading-6 text-zinc-600">
      {children}
    </aside>
  );
}
