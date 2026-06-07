"use client";

import { cn } from "@/lib/utils";

type OptionButtonProps = {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
};

export function OptionButton({
  label,
  isSelected,
  onSelect,
}: Readonly<OptionButtonProps>) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onSelect}
      className={cn(
        "min-h-12 w-full rounded-md border px-4 py-3 text-left text-sm font-medium leading-5 transition-colors",
        isSelected
          ? "border-teal-700 bg-teal-700 text-white"
          : "border-zinc-200 bg-white text-zinc-800 hover:border-teal-700 hover:bg-teal-50",
      )}
    >
      {label}
    </button>
  );
}
