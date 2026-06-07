"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { QuestionCard } from "@/components/onboarding/QuestionCard";
import { useAppState } from "@/hooks/useAppState";
import type {
  BsnStatus,
  HousingStatus,
  OnboardingArrivalStatus,
  ResidencyCategory,
  StudentProfile,
  WorkOrPaidInternship,
} from "@/types/profile";

type OnboardingAnswers = {
  residencyCategory?: ResidencyCategory;
  housingStatus?: HousingStatus;
  onboardingArrivalStatus?: OnboardingArrivalStatus;
  bsnStatus?: BsnStatus;
  workOrPaidInternship?: WorkOrPaidInternship;
};

const residencyOptions = [
  { label: "EU/EEA/Swiss", value: "eu_eea_swiss" },
  { label: "Non-EU/EEA", value: "non_eu_eea" },
  { label: "Not sure", value: "not_sure" },
] as const;

const housingOptions = [
  { label: "I have housing", value: "confirmed" },
  { label: "Still searching", value: "searching" },
  { label: "Temporary housing only", value: "temporary_only" },
  { label: "Not started", value: "not_started" },
] as const;

const arrivalOptions = [
  { label: "Before arrival", value: "before_arrival" },
  { label: "Already arrived", value: "already_arrived" },
] as const;

const bsnOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
  { label: "Not sure", value: "not_sure" },
] as const;

const workOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
  { label: "Maybe", value: "maybe" },
] as const;

function isComplete(answers: OnboardingAnswers) {
  return Boolean(
    answers.residencyCategory &&
      answers.housingStatus &&
      answers.onboardingArrivalStatus &&
      answers.bsnStatus &&
      answers.workOrPaidInternship,
  );
}

function createProfile(answers: Required<OnboardingAnswers>): StudentProfile {
  const now = new Date().toISOString();

  return {
    id: `profile-${Date.now()}`,
    residencyCategory: answers.residencyCategory,
    nationalityGroup:
      answers.residencyCategory === "not_sure"
        ? undefined
        : answers.residencyCategory === "eu_eea_swiss"
          ? "eu_eea_swiss"
          : "non_eu_eea_swiss",
    onboardingArrivalStatus: answers.onboardingArrivalStatus,
    arrivalStatus:
      answers.onboardingArrivalStatus === "before_arrival"
        ? "planning"
        : "arrived",
    housingStatus: answers.housingStatus,
    bsnStatus: answers.bsnStatus,
    workOrPaidInternship: answers.workOrPaidInternship,
    hasHousing: answers.housingStatus === "confirmed",
    hasBsn: answers.bsnStatus === "yes",
    needsVisaOrResidencePermit:
      answers.residencyCategory === "non_eu_eea" ? true : undefined,
    insuranceSituation: "unknown",
    hasDutchBankAccount: false,
    hasDutchPhoneNumber: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function OnboardingForm() {
  const router = useRouter();
  const { saveProfile, clearAllLocalData, storageAvailable, isHydrated } =
    useAppState();
  const [answers, setAnswers] = useState<OnboardingAnswers>({});
  const canSubmit = useMemo(() => isComplete(answers), [answers]);

  function updateAnswer<TKey extends keyof OnboardingAnswers>(
    key: TKey,
    value: NonNullable<OnboardingAnswers[TKey]>,
  ) {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [key]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isComplete(answers)) {
      return;
    }

    saveProfile(createProfile(answers as Required<OnboardingAnswers>));
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <QuestionCard
        title="Residency category"
        options={residencyOptions}
        value={answers.residencyCategory}
        onChange={(value) => updateAnswer("residencyCategory", value)}
      />
      <QuestionCard
        title="Housing status"
        options={housingOptions}
        value={answers.housingStatus}
        onChange={(value) => updateAnswer("housingStatus", value)}
      />
      <QuestionCard
        title="Arrival status"
        options={arrivalOptions}
        value={answers.onboardingArrivalStatus}
        onChange={(value) => updateAnswer("onboardingArrivalStatus", value)}
      />
      <QuestionCard
        title="BSN status"
        options={bsnOptions}
        value={answers.bsnStatus}
        onChange={(value) => updateAnswer("bsnStatus", value)}
      />
      <QuestionCard
        title="Work or paid internship"
        options={workOptions}
        value={answers.workOrPaidInternship}
        onChange={(value) => updateAnswer("workOrPaidInternship", value)}
      />

      <div className="space-y-3 pt-1">
        <button
          type="submit"
          disabled={!canSubmit}
          className="h-12 w-full rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
        >
          Save and continue
        </button>
        <button
          type="button"
          onClick={clearAllLocalData}
          className="h-11 w-full rounded-md border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100"
        >
          Clear local data
        </button>
        {isHydrated && !storageAvailable ? (
          <p className="text-sm leading-6 text-red-700">
            Local browser storage is unavailable, so your answers may not
            persist after reload.
          </p>
        ) : null}
      </div>
    </form>
  );
}
