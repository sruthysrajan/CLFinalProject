import { OnboardingForm } from "@/components/onboarding/OnboardingForm";

export default function OnboardingPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-teal-700">First setup</p>
        <h2 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950">
          Onboarding
        </h2>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Answer five questions so the guide can prioritise the most relevant
          first steps.
        </p>
      </div>
      <OnboardingForm />
    </section>
  );
}
