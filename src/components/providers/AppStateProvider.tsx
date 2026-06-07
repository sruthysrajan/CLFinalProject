"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import contentMeta from "@/data/content-meta.json";
import {
  isLocalStorageAvailable,
  safeReadJson,
  safeRemove,
  safeWriteJson,
  STORAGE_KEYS,
} from "@/lib/storage";
import type { FeedbackResponse, SaveFeedbackInput } from "@/types/feedback";
import type { StudentProfile } from "@/types/profile";
import type { TaskProgress, TaskProgressStatus } from "@/types/progress";
import type { TaskId } from "@/types/content";

export type AppStateContextValue = {
  profile: StudentProfile | null;
  taskProgress: Record<string, TaskProgress>;
  feedbackResponses: FeedbackResponse[];
  onboardingCompleted: boolean;
  isHydrated: boolean;
  storageAvailable: boolean;
  saveProfile: (profile: StudentProfile) => void;
  resetProfile: () => void;
  setTaskStatus: (
    taskId: TaskId,
    status: TaskProgressStatus,
    notes?: string,
  ) => void;
  saveFeedback: (feedback: SaveFeedbackInput) => void;
  clearFeedback: () => void;
  clearAllLocalData: () => void;
};

export const AppStateContext = createContext<AppStateContextValue | null>(null);

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}`;
}

export function AppStateProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [taskProgress, setTaskProgress] = useState<Record<string, TaskProgress>>(
    {},
  );
  const [feedbackResponses, setFeedbackResponses] = useState<
    FeedbackResponse[]
  >([]);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    queueMicrotask(() => {
      if (isCancelled) {
        return;
      }

      const available = isLocalStorageAvailable();
      const now = new Date().toISOString();

      setStorageAvailable(available);
      setProfile(
        safeReadJson<StudentProfile | null>(STORAGE_KEYS.profile, null),
      );
      setTaskProgress(
        safeReadJson<Record<string, TaskProgress>>(
          STORAGE_KEYS.taskProgress,
          {},
        ),
      );
      setFeedbackResponses(
        safeReadJson<FeedbackResponse[]>(STORAGE_KEYS.feedbackResponses, []),
      );
      setOnboardingCompleted(
        safeReadJson<boolean>(STORAGE_KEYS.onboardingCompleted, false),
      );

      safeWriteJson(STORAGE_KEYS.contentVersion, contentMeta.version);
      safeWriteJson(STORAGE_KEYS.lastVisitedAt, now);
      setIsHydrated(true);
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  const saveProfile = useCallback((nextProfile: StudentProfile) => {
    const writeSucceeded = safeWriteJson(STORAGE_KEYS.profile, nextProfile);
    const onboardingWriteSucceeded = safeWriteJson(
      STORAGE_KEYS.onboardingCompleted,
      true,
    );

    setProfile(nextProfile);
    setOnboardingCompleted(true);
    setStorageAvailable(writeSucceeded && onboardingWriteSucceeded);
  }, []);

  const resetProfile = useCallback(() => {
    const profileRemoved = safeRemove(STORAGE_KEYS.profile);
    const onboardingRemoved = safeRemove(STORAGE_KEYS.onboardingCompleted);

    setProfile(null);
    setOnboardingCompleted(false);
    setStorageAvailable(profileRemoved && onboardingRemoved);
  }, []);

  const setTaskStatus = useCallback(
    (taskId: TaskId, status: TaskProgressStatus, notes?: string) => {
      setTaskProgress((currentProgress) => {
        const now = new Date().toISOString();
        const nextProgress = {
          ...currentProgress,
          [taskId]: {
            taskId,
            status,
            updatedAt: now,
            completedAt: status === "done" ? now : undefined,
            notes,
          },
        };

        const writeSucceeded = safeWriteJson(
          STORAGE_KEYS.taskProgress,
          nextProgress,
        );
        setStorageAvailable(writeSucceeded);

        return nextProgress;
      });
    },
    [],
  );

  const saveFeedback = useCallback((feedback: SaveFeedbackInput) => {
    setFeedbackResponses((currentResponses) => {
      const nextFeedback: FeedbackResponse = {
        id: feedback.id ?? createId("feedback"),
        sourceType: feedback.sourceType,
        sourceId: feedback.sourceId,
        wasHelpful: feedback.wasHelpful,
        issueType: feedback.issueType,
        comment: feedback.comment,
        createdAt: feedback.createdAt ?? new Date().toISOString(),
        appContentVersion: feedback.appContentVersion ?? contentMeta.version,
        profileSnapshot: feedback.profileSnapshot ?? profile,
      };
      const nextResponses = [...currentResponses, nextFeedback];
      const writeSucceeded = safeWriteJson(
        STORAGE_KEYS.feedbackResponses,
        nextResponses,
      );

      setStorageAvailable(writeSucceeded);
      return nextResponses;
    });
  }, [profile]);

  const clearFeedback = useCallback(() => {
    const removed = safeRemove(STORAGE_KEYS.feedbackResponses);

    setFeedbackResponses([]);
    setStorageAvailable(removed);
  }, []);

  const clearAllLocalData = useCallback(() => {
    const results = Object.values(STORAGE_KEYS).map((key) => safeRemove(key));

    setProfile(null);
    setTaskProgress({});
    setFeedbackResponses([]);
    setOnboardingCompleted(false);
    setStorageAvailable(results.every(Boolean));
  }, []);

  const contextValue = useMemo<AppStateContextValue>(
    () => ({
      profile,
      taskProgress,
      feedbackResponses,
      onboardingCompleted,
      isHydrated,
      storageAvailable,
      saveProfile,
      resetProfile,
      setTaskStatus,
      saveFeedback,
      clearFeedback,
      clearAllLocalData,
    }),
    [
      clearAllLocalData,
      clearFeedback,
      feedbackResponses,
      isHydrated,
      onboardingCompleted,
      profile,
      resetProfile,
      saveFeedback,
      saveProfile,
      setTaskStatus,
      storageAvailable,
      taskProgress,
    ],
  );

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  );
}
