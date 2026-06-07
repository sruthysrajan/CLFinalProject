import type { Task, TaskId } from "@/types/content";
import type { StudentProfile } from "@/types/profile";
import type { TaskProgress } from "@/types/progress";

export type TaskUrgency = "urgent" | "important" | "normal" | "later";

export type TaskApplicability = "applicable" | "maybe_applicable";

export type PersonalisedTask = Task & {
  urgency: TaskUrgency;
  applicability: TaskApplicability;
  priorityScore: number;
  personalisationReasons: string[];
};

const urgencyRank: Record<TaskUrgency, number> = {
  urgent: 4,
  important: 3,
  normal: 2,
  later: 1,
};

function isUnresolvedHousing(profile: StudentProfile) {
  const housingStatus = profile.housingStatus as string;

  return [
    "searching",
    "still_searching",
    "temporary_only",
    "temporary_housing",
    "not_started",
  ].includes(housingStatus);
}

function isNonEea(profile: StudentProfile) {
  return ["non_eu_eea", "non_eea"].includes(profile.residencyCategory);
}

function isAlreadyArrived(profile: StudentProfile) {
  return profile.onboardingArrivalStatus === "already_arrived";
}

function hasNoOrUnknownBsn(profile: StudentProfile) {
  return profile.bsnStatus === "no" || profile.bsnStatus === "not_sure";
}

function hasWorkOrInternshipPlan(profile: StudentProfile) {
  return (
    profile.workOrPaidInternship === "yes" ||
    profile.workOrPaidInternship === "maybe"
  );
}

function createPersonalisedTask(task: Task): PersonalisedTask {
  return {
    ...task,
    urgency: "normal",
    applicability: "applicable",
    priorityScore: task.basePriority,
    personalisationReasons: [],
  };
}

function applyPersonalisation(
  task: PersonalisedTask,
  urgency: TaskUrgency,
  applicability: TaskApplicability,
  priorityAdjustment: number,
  reason: string,
) {
  return {
    ...task,
    urgency,
    applicability,
    priorityScore: task.basePriority + priorityAdjustment,
    personalisationReasons: [...task.personalisationReasons, reason],
  };
}

export function getPersonalisedTasks(
  tasks: readonly Task[],
  profile: StudentProfile | null,
) {
  const personalisedTasks = tasks.map(createPersonalisedTask);

  if (!profile) {
    return personalisedTasks;
  }

  return personalisedTasks.map((task) => {
    if (task.id === "housing_sos" && isUnresolvedHousing(profile)) {
      return applyPersonalisation(
        task,
        "urgent",
        "applicable",
        1000,
        "Housing is unresolved.",
      );
    }

    if (task.id === "housing_sos" && profile.housingStatus === "confirmed") {
      return applyPersonalisation(
        task,
        "later",
        "maybe_applicable",
        -80,
        "You already indicated that you have housing.",
      );
    }

    if (task.id === "visa_residence_permit" && isNonEea(profile)) {
      return applyPersonalisation(
        task,
        "important",
        "applicable",
        700,
        "Non-EU/EEA students commonly need immigration checks.",
      );
    }

    if (
      task.id === "visa_residence_permit" &&
      profile.residencyCategory === "not_sure"
    ) {
      return applyPersonalisation(
        task,
        "important",
        "maybe_applicable",
        650,
        "Residency category is not clear yet.",
      );
    }

    if (
      (task.id === "municipality_registration" || task.id === "bsn") &&
      isAlreadyArrived(profile) &&
      hasNoOrUnknownBsn(profile)
    ) {
      return applyPersonalisation(
        task,
        "urgent",
        "applicable",
        950,
        "You have arrived and your BSN is not confirmed.",
      );
    }

    if (task.id === "health_insurance" && hasWorkOrInternshipPlan(profile)) {
      return applyPersonalisation(
        task,
        "important",
        "applicable",
        500,
        "Work or a paid internship can affect health insurance rules.",
      );
    }

    if (task.id === "bsn" && profile.bsnStatus === "yes") {
      return applyPersonalisation(
        task,
        "later",
        "maybe_applicable",
        -60,
        "You already indicated that you have a BSN.",
      );
    }

    return task;
  });
}

function isCompletedOrSkipped(
  taskId: TaskId,
  taskProgress: Record<string, TaskProgress>,
) {
  const status = taskProgress[taskId]?.status;

  return status === "done" || status === "skipped";
}

export function sortPersonalisedTasks(tasks: readonly PersonalisedTask[]) {
  return [...tasks].sort((a, b) => {
    const urgencyDifference = urgencyRank[b.urgency] - urgencyRank[a.urgency];

    if (urgencyDifference !== 0) {
      return urgencyDifference;
    }

    if (b.priorityScore !== a.priorityScore) {
      return b.priorityScore - a.priorityScore;
    }

    return a.title.localeCompare(b.title);
  });
}

export function getTopNextActions(
  personalisedTasks: readonly PersonalisedTask[],
  taskProgress: Record<string, TaskProgress>,
  limit: number,
) {
  return sortPersonalisedTasks(
    personalisedTasks.filter(
      (task) => !isCompletedOrSkipped(task.id, taskProgress),
    ),
  ).slice(0, limit);
}
