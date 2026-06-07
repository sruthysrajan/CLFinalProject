import { describe, expect, it } from "vitest";

import {
  exportFeedbackAsCsv,
  exportFeedbackAsJson,
} from "@/lib/feedback-export";
import type { FeedbackResponse } from "@/types/feedback";

function createFeedback(
  overrides: Partial<FeedbackResponse> = {},
): FeedbackResponse {
  return {
    id: "feedback-1",
    sourceType: "general",
    wasHelpful: true,
    comment: "Useful",
    createdAt: "2026-06-07T12:00:00.000Z",
    appContentVersion: "0.1.0",
    profileSnapshot: null,
    ...overrides,
  };
}

describe("feedback export", () => {
  it("exports JSON with all feedback records", () => {
    const feedback = [
      createFeedback({ id: "feedback-1" }),
      createFeedback({ id: "feedback-2", sourceType: "task" }),
    ];

    expect(JSON.parse(exportFeedbackAsJson(feedback))).toEqual(feedback);
  });

  it("exports CSV headers", () => {
    expect(exportFeedbackAsCsv([]).split("\n")[0]).toBe(
      "id,sourceType,sourceId,wasHelpful,issueType,comment,createdAt,appContentVersion,profileSnapshot",
    );
  });

  it("escapes commas in CSV values", () => {
    const csv = exportFeedbackAsCsv([
      createFeedback({ comment: "Housing, BSN, and banking" }),
    ]);

    expect(csv).toContain("\"Housing, BSN, and banking\"");
  });

  it("escapes quotes in CSV values", () => {
    const csv = exportFeedbackAsCsv([
      createFeedback({ comment: "The word \"permit\" is unclear" }),
    ]);

    expect(csv).toContain("\"The word \"\"permit\"\" is unclear\"");
  });

  it("handles newlines in CSV values", () => {
    const csv = exportFeedbackAsCsv([
      createFeedback({ comment: "First line\nSecond line" }),
    ]);

    expect(csv).toContain("\"First line\nSecond line\"");
  });

  it("exports empty feedback safely", () => {
    expect(exportFeedbackAsJson([])).toBe("[]");
    expect(exportFeedbackAsCsv([])).toBe(
      "id,sourceType,sourceId,wasHelpful,issueType,comment,createdAt,appContentVersion,profileSnapshot",
    );
  });
});
