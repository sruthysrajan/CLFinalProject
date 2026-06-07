"use client";

import { useAppState } from "@/hooks/useAppState";

function formatHelpful(value: boolean | null) {
  if (value === true) {
    return "Helpful";
  }

  if (value === false) {
    return "Not helpful";
  }

  return "Not sure";
}

export function FeedbackList() {
  const { feedbackResponses, isHydrated } = useAppState();
  const responses = [...feedbackResponses].reverse();

  return (
    <section className="space-y-3">
      <h3 className="text-lg font-semibold text-zinc-950">Saved feedback</h3>

      {!isHydrated ? (
        <div className="h-24 rounded-lg bg-zinc-100" />
      ) : responses.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <p className="text-sm leading-6 text-zinc-600">
            No feedback saved in this browser yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {responses.map((feedback) => (
            <article
              key={feedback.id}
              className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-800">
                  {feedback.sourceType}
                </span>
                {feedback.sourceId ? (
                  <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-700">
                    {feedback.sourceId}
                  </span>
                ) : null}
                <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-700">
                  {formatHelpful(feedback.wasHelpful)}
                </span>
              </div>
              {feedback.issueType ? (
                <p className="text-sm font-semibold text-zinc-800">
                  {feedback.issueType.replaceAll("_", " ")}
                </p>
              ) : null}
              {feedback.comment ? (
                <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-600">
                  {feedback.comment}
                </p>
              ) : null}
              <p className="text-xs font-medium text-zinc-500">
                {new Date(feedback.createdAt).toLocaleString()} · content{" "}
                {feedback.appContentVersion}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
