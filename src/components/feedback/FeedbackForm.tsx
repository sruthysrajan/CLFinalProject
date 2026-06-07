"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { useAppState } from "@/hooks/useAppState";
import type {
  FeedbackIssueType,
  FeedbackSourceType,
} from "@/types/feedback";

type FeedbackFormProps = {
  sourceType?: FeedbackSourceType;
  sourceId?: string;
  title?: string;
  compact?: boolean;
};

const issueOptions: Array<{ value: FeedbackIssueType; label: string }> = [
  { value: "confusing", label: "Confusing" },
  { value: "outdated", label: "Outdated" },
  { value: "missing_information", label: "Missing information" },
  { value: "broken_link", label: "Broken link" },
  { value: "does_not_apply", label: "Does not apply" },
  { value: "other", label: "Other" },
];

export function FeedbackForm({
  sourceType = "general",
  sourceId,
  title = "Share feedback",
  compact = false,
}: Readonly<FeedbackFormProps>) {
  const { saveFeedback, isHydrated } = useAppState();
  const [wasHelpful, setWasHelpful] = useState<boolean | null>(null);
  const [hasHelpfulnessAnswer, setHasHelpfulnessAnswer] = useState(false);
  const [issueType, setIssueType] = useState<FeedbackIssueType | "">("");
  const [comment, setComment] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasHelpfulnessAnswer) {
      setError("Select whether this was helpful before saving feedback.");
      return;
    }

    saveFeedback({
      sourceType,
      sourceId,
      wasHelpful,
      issueType: issueType || undefined,
      comment: comment.trim() || undefined,
    });

    setIssueType("");
    setComment("");
    setSaved(true);
    setError("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4"
    >
      <div>
        <h3 className="text-base font-semibold text-zinc-950">{title}</h3>
        {sourceId ? (
          <p className="mt-1 text-xs font-medium text-zinc-500">
            {sourceType}: {sourceId}
          </p>
        ) : null}
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-zinc-800">
          Was this helpful? <span className="text-red-700">Required</span>
        </legend>
        <div
          className="grid grid-cols-3 gap-2"
          aria-describedby={error ? "feedback-helpfulness-error" : undefined}
          aria-invalid={error ? "true" : undefined}
        >
          {[
            { label: "Yes", value: true },
            { label: "No", value: false },
            { label: "Not sure", value: null },
          ].map((option) => (
            <button
              key={option.label}
              type="button"
              aria-pressed={hasHelpfulnessAnswer && wasHelpful === option.value}
              onClick={() => {
                setWasHelpful(option.value);
                setHasHelpfulnessAnswer(true);
                setError("");
                setSaved(false);
              }}
              className={`h-11 rounded-md border px-2 text-sm font-semibold transition-colors ${
                hasHelpfulnessAnswer && wasHelpful === option.value
                  ? "border-teal-700 bg-teal-50 text-teal-800"
                  : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {error ? (
          <p id="feedback-helpfulness-error" className="text-sm text-red-700">
            {error}
          </p>
        ) : null}
      </fieldset>

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-zinc-800">
          Issue type
        </span>
        <select
          value={issueType}
          onChange={(event) =>
            setIssueType(event.target.value as FeedbackIssueType | "")
          }
          className="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-teal-700"
        >
          <option value="">No issue type</option>
          {issueOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-zinc-800">Comment</span>
        <textarea
          value={comment}
          onChange={(event) => {
            setComment(event.target.value);
            setSaved(false);
          }}
          rows={compact ? 3 : 4}
          placeholder="What should be improved?"
          className="w-full resize-y rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-teal-700"
        />
      </label>

      <button
        type="submit"
        disabled={!isHydrated}
        className="h-11 w-full rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        Save feedback
      </button>

      {saved ? (
        <p className="text-sm font-medium text-teal-800">Feedback saved.</p>
      ) : null}
    </form>
  );
}
