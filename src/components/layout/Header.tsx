export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-[#fbfcf8]/95 px-5 py-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            Student guide
          </p>
          <h1 className="text-lg font-semibold text-zinc-950">NL First 100</h1>
        </div>
      </div>
    </header>
  );
}
