"use client";

import {
  exportFeedbackAsCsv,
  exportFeedbackAsJson,
} from "@/lib/feedback-export";
import { useAppState } from "@/hooks/useAppState";

function downloadTextFile(filename: string, mimeType: string, contents: string) {
  const blob = new Blob([contents], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function getDateStamp() {
  return new Date().toISOString().slice(0, 10);
}

export function FeedbackExportPanel() {
  const { feedbackResponses, clearFeedback, isHydrated } = useAppState();
  const count = feedbackResponses.length;

  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4">
      <div>
        <h3 className="text-base font-semibold text-zinc-950">
          Export feedback
        </h3>
        <p className="mt-1 text-sm leading-6 text-zinc-600">
          {count} locally saved {count === 1 ? "response" : "responses"}.
        </p>
      </div>

      <div className="grid gap-2">
        <button
          type="button"
          disabled={!isHydrated}
          onClick={() =>
            downloadTextFile(
              `nl-first-100-feedback-${getDateStamp()}.json`,
              "application/json",
              exportFeedbackAsJson(feedbackResponses),
            )
          }
          className="h-11 rounded-md border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400"
        >
          Export JSON
        </button>
        <button
          type="button"
          disabled={!isHydrated}
          onClick={() =>
            downloadTextFile(
              `nl-first-100-feedback-${getDateStamp()}.csv`,
              "text/csv;charset=utf-8",
              exportFeedbackAsCsv(feedbackResponses),
            )
          }
          className="h-11 rounded-md border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400"
        >
          Export CSV
        </button>
        <button
          type="button"
          disabled={!isHydrated || count === 0}
          onClick={clearFeedback}
          className="h-11 rounded-md bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          Clear feedback
        </button>
      </div>
    </section>
  );
}
