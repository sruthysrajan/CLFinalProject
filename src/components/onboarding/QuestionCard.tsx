"use client";

import { OptionButton } from "@/components/onboarding/OptionButton";

type QuestionOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type QuestionCardProps<TValue extends string> = {
  title: string;
  options: readonly QuestionOption<TValue>[];
  value?: TValue;
  onChange: (value: TValue) => void;
};

export function QuestionCard<TValue extends string>({
  title,
  options,
  value,
  onChange,
}: Readonly<QuestionCardProps<TValue>>) {
  return (
    <fieldset className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4">
      <legend className="px-1 text-base font-semibold text-zinc-950">
        {title}
      </legend>
      <div className="grid gap-2">
        {options.map((option) => (
          <OptionButton
            key={option.value}
            label={option.label}
            isSelected={value === option.value}
            onSelect={() => onChange(option.value)}
          />
        ))}
      </div>
    </fieldset>
  );
}
