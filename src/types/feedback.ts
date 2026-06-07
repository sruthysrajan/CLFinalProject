import type { StudentProfile } from "@/types/profile";

export type FeedbackSourceType = "general" | "task" | "topic" | "faq";

export type FeedbackIssueType =
  | "confusing"
  | "outdated"
  | "missing_information"
  | "broken_link"
  | "does_not_apply"
  | "other";

export type FeedbackResponse = {
  id: string;
  sourceType: FeedbackSourceType;
  sourceId?: string;
  wasHelpful: boolean | null;
  issueType?: FeedbackIssueType;
  comment?: string;
  createdAt: string;
  appContentVersion: string;
  profileSnapshot: StudentProfile | null;
};

export type SaveFeedbackInput =
  Omit<
    FeedbackResponse,
    "id" | "createdAt" | "appContentVersion" | "profileSnapshot"
  > &
    Partial<
      Pick<
        FeedbackResponse,
        "id" | "createdAt" | "appContentVersion" | "profileSnapshot"
      >
    >;
