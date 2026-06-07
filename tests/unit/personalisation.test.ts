import { describe, expect, it } from "vitest";

import { getAllTasks } from "@/lib/content";
import {
  getPersonalisedTasks,
  getTopNextActions,
} from "@/lib/personalisation";
import type { TaskId } from "@/types/content";
import type {
  BsnStatus,
  HousingStatus,
  OnboardingArrivalStatus,
  ResidencyCategory,
  StudentProfile,
  WorkOrPaidInternship,
} from "@/types/profile";

function createProfile(overrides: {
  residencyCategory: ResidencyCategory;
  housingStatus: HousingStatus;
  onboardingArrivalStatus: OnboardingArrivalStatus;
  bsnStatus: BsnStatus;
  workOrPaidInternship: WorkOrPaidInternship;
}): StudentProfile {
  return {
    id: "test-profile",
    ...overrides,
    hasHousing: overrides.housingStatus === "confirmed",
    hasBsn: overrides.bsnStatus === "yes",
    createdAt: "2026-06-07T00:00:00.000Z",
    updatedAt: "2026-06-07T00:00:00.000Z",
  };
}

function byId(tasks: ReturnType<typeof getPersonalisedTasks>, taskId: TaskId) {
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    throw new Error(`Missing task ${taskId}`);
  }

  return task;
}

describe("personalisation", () => {
  it("prioritises non-EU users with no housing before arrival and maybe working", () => {
    const profile = createProfile({
      residencyCategory: "non_eu_eea",
      housingStatus: "searching",
      onboardingArrivalStatus: "before_arrival",
      bsnStatus: "no",
      workOrPaidInternship: "maybe",
    });
    const tasks = getPersonalisedTasks(getAllTasks(), profile);
    const topActions = getTopNextActions(tasks, {}, 3).map((task) => task.id);

    expect(byId(tasks, "housing_sos").urgency).toBe("urgent");
    expect(byId(tasks, "visa_residence_permit")).toMatchObject({
      urgency: "important",
      applicability: "applicable",
    });
    expect(byId(tasks, "health_insurance").urgency).toBe("important");
    expect(topActions).toContain("housing_sos");
  });

  it("keeps EU users with housing before arrival on lower-priority general tasks", () => {
    const profile = createProfile({
      residencyCategory: "eu_eea_swiss",
      housingStatus: "confirmed",
      onboardingArrivalStatus: "before_arrival",
      bsnStatus: "no",
      workOrPaidInternship: "no",
    });
    const tasks = getPersonalisedTasks(getAllTasks(), profile);

    expect(byId(tasks, "housing_sos")).toMatchObject({
      urgency: "later",
      applicability: "maybe_applicable",
    });
    expect(byId(tasks, "visa_residence_permit").urgency).toBe("normal");
    expect(byId(tasks, "health_insurance").urgency).toBe("normal");
    expect(getTopNextActions(tasks, {}, 3).map((task) => task.id)).not.toContain(
      "housing_sos",
    );
  });

  it("makes municipality registration and BSN urgent after arrival without BSN", () => {
    const profile = createProfile({
      residencyCategory: "eu_eea_swiss",
      housingStatus: "temporary_only",
      onboardingArrivalStatus: "already_arrived",
      bsnStatus: "no",
      workOrPaidInternship: "maybe",
    });
    const tasks = getPersonalisedTasks(getAllTasks(), profile);
    const topActions = getTopNextActions(tasks, {}, 3).map((task) => task.id);

    expect(byId(tasks, "housing_sos").urgency).toBe("urgent");
    expect(byId(tasks, "municipality_registration").urgency).toBe("urgent");
    expect(byId(tasks, "bsn").urgency).toBe("urgent");
    expect(byId(tasks, "health_insurance").urgency).toBe("important");
    expect(topActions).toEqual(
      expect.arrayContaining([
        "housing_sos",
        "municipality_registration",
        "bsn",
      ]),
    );
  });

  it("marks visa as maybe applicable when residency category is not sure", () => {
    const profile = createProfile({
      residencyCategory: "not_sure",
      housingStatus: "confirmed",
      onboardingArrivalStatus: "before_arrival",
      bsnStatus: "not_sure",
      workOrPaidInternship: "no",
    });
    const tasks = getPersonalisedTasks(getAllTasks(), profile);

    expect(byId(tasks, "visa_residence_permit")).toMatchObject({
      urgency: "important",
      applicability: "maybe_applicable",
    });
  });

  it("moves BSN later when the user already has a BSN", () => {
    const profile = createProfile({
      residencyCategory: "eu_eea_swiss",
      housingStatus: "confirmed",
      onboardingArrivalStatus: "already_arrived",
      bsnStatus: "yes",
      workOrPaidInternship: "no",
    });
    const tasks = getPersonalisedTasks(getAllTasks(), profile);

    expect(byId(tasks, "bsn")).toMatchObject({
      urgency: "later",
      applicability: "maybe_applicable",
    });
  });

  it("produces different top next actions for different profiles", () => {
    const firstProfile = createProfile({
      residencyCategory: "non_eu_eea",
      housingStatus: "searching",
      onboardingArrivalStatus: "before_arrival",
      bsnStatus: "no",
      workOrPaidInternship: "maybe",
    });
    const secondProfile = createProfile({
      residencyCategory: "eu_eea_swiss",
      housingStatus: "confirmed",
      onboardingArrivalStatus: "before_arrival",
      bsnStatus: "no",
      workOrPaidInternship: "no",
    });

    const firstTopActions = getTopNextActions(
      getPersonalisedTasks(getAllTasks(), firstProfile),
      {},
      3,
    ).map((task) => task.id);
    const secondTopActions = getTopNextActions(
      getPersonalisedTasks(getAllTasks(), secondProfile),
      {},
      3,
    ).map((task) => task.id);

    expect(firstTopActions).not.toEqual(secondTopActions);
  });
});
