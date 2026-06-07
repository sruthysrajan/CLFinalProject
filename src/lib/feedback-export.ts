import type { FeedbackResponse } from "@/types/feedback";

const csvHeaders = [
  "id",
  "sourceType",
  "sourceId",
  "wasHelpful",
  "issueType",
  "comment",
  "createdAt",
  "appContentVersion",
  "profileSnapshot",
] as const;

function stringifyValue(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  return JSON.stringify(value);
}

export function escapeCsvValue(value: unknown) {
  const stringValue = stringifyValue(value);

  if (/[",\r\n]/.test(stringValue)) {
    return `"${stringValue.replaceAll("\"", "\"\"")}"`;
  }

  return stringValue;
}

export function exportFeedbackAsJson(
  feedbackResponses: readonly FeedbackResponse[],
) {
  return JSON.stringify(feedbackResponses, null, 2);
}

export function exportFeedbackAsCsv(
  feedbackResponses: readonly FeedbackResponse[],
) {
  const rows = feedbackResponses.map((feedback) =>
    csvHeaders
      .map((header) => escapeCsvValue(feedback[header]))
      .join(","),
  );

  return [csvHeaders.join(","), ...rows].join("\n");
}
