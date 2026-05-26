"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Sex, ActivityLevel, Goal, Profile } from "@/lib/macros";
import { activityLabels, goalLabels, calculateMacros } from "@/lib/macros";

const TOTAL_STEPS = 3;

interface FormData {
  name: string;
  age: string;
  sex: Sex | "";
  weightKg: string;
  heightCm: string;
  activity: ActivityLevel | "";
  goal: Goal | "";
}

type FormErrors = Partial<Record<keyof FormData, string>>;

const defaultForm: FormData = {
  name: "",
  age: "",
  sex: "",
  weightKg: "",
  heightCm: "",
  activity: "",
  goal: "",
};

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [errors, setErrors] = useState<FormErrors>({});

  function set(key: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validateStep(): boolean {
    const newErrors: FormErrors = {};
    if (step === 1) {
      if (!form.name.trim()) newErrors.name = "Name required";
      if (!form.sex) newErrors.sex = "Select sex";
      const age = Number(form.age);
      if (!form.age || age < 16 || age > 99) newErrors.age = "Enter a valid age";
    }
    if (step === 2) {
      const w = Number(form.weightKg);
      const h = Number(form.heightCm);
      if (!form.weightKg || w < 30 || w > 300) newErrors.weightKg = "Enter weight in kg (30-300)";
      if (!form.heightCm || h < 100 || h > 250) newErrors.heightCm = "Enter height in cm (100-250)";
      if (!form.activity) newErrors.activity = "Select activity level";
    }
    if (step === 3) {
      if (!form.goal) newErrors.goal = "Select a goal";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function next() {
    if (!validateStep()) return;
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      const profile: Profile = {
        name: form.name,
        age: Number(form.age),
        weightKg: Number(form.weightKg),
        heightCm: Number(form.heightCm),
        sex: form.sex as Sex,
        activity: form.activity as ActivityLevel,
        goal: form.goal as Goal,
      };
      const macros = calculateMacros(profile);
      localStorage.setItem("fck_profile", JSON.stringify(profile));
      localStorage.setItem("fck_macros", JSON.stringify(macros));
      router.push("/dashboard");
    }
  }

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <main className="pt-16 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-text-secondary font-medium">Step {step} of {TOTAL_STEPS}</p>
            <p className="text-sm text-lime font-semibold">{Math.round(progress)}%</p>
          </div>
          <div className="h-1 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-lime rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8">
          {step === 1 && (
            <div>
              <h1 className="text-3xl font-black mb-2">Let&apos;s start with you.</h1>
              <p className="text-text-secondary mb-8">Basic info to personalize your plan.</p>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-text-secondary block mb-2">Your name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="First name"
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-lime transition-colors"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="text-sm font-semibold text-text-secondary block mb-2">Age</label>
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => set("age", e.target.value)}
                    placeholder="e.g. 28"
                    min={16}
                    max={99}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-lime transition-colors"
                  />
                  {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age}</p>}
                </div>

                <div>
                  <label className="text-sm font-semibold text-text-secondary block mb-2">Biological sex</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["male", "female"] as Sex[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => set("sex", s)}
                        className={`py-3 rounded-xl border font-semibold capitalize transition-all ${
                          form.sex === s
                            ? "border-lime bg-lime/10 text-lime"
                            : "border-border bg-surface text-text-secondary hover:border-border-light"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {errors.sex && <p className="text-red-400 text-sm mt-1">{errors.sex}</p>}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-3xl font-black mb-2">Your body stats.</h1>
              <p className="text-text-secondary mb-8">Used to calculate your TDEE and macro targets.</p>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-text-secondary block mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    value={form.weightKg}
                    onChange={(e) => set("weightKg", e.target.value)}
                    placeholder="e.g. 80"
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-lime transition-colors"
                  />
                  {errors.weightKg && <p className="text-red-400 text-sm mt-1">{errors.weightKg}</p>}
                </div>

                <div>
                  <label className="text-sm font-semibold text-text-secondary block mb-2">Height (cm)</label>
                  <input
                    type="number"
                    value={form.heightCm}
                    onChange={(e) => set("heightCm", e.target.value)}
                    placeholder="e.g. 178"
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-lime transition-colors"
                  />
                  {errors.heightCm && <p className="text-red-400 text-sm mt-1">{errors.heightCm}</p>}
                </div>

                <div>
                  <label className="text-sm font-semibold text-text-secondary block mb-2">Activity level</label>
                  <div className="space-y-2">
                    {(Object.entries(activityLabels) as [ActivityLevel, string][]).map(([val, label]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => set("activity", val)}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                          form.activity === val
                            ? "border-lime bg-lime/10 text-lime"
                            : "border-border bg-surface text-text-secondary hover:border-border-light"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {errors.activity && <p className="text-red-400 text-sm mt-1">{errors.activity}</p>}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="text-3xl font-black mb-2">What&apos;s the goal?</h1>
              <p className="text-text-secondary mb-8">This sets your calorie target.</p>

              <div className="space-y-3">
                {(Object.entries(goalLabels) as [Goal, string][]).map(([val, label]) => {
                  const descriptions: Record<Goal, string> = {
                    cut: "500 kcal deficit. Maximum fat loss while preserving muscle.",
                    maintain: "Eat at TDEE. Body recomposition or maintenance phase.",
                    bulk: "300 kcal surplus. Lean muscle gain with minimal fat.",
                  };
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => set("goal", val)}
                      className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${
                        form.goal === val
                          ? "border-lime bg-lime/10"
                          : "border-border bg-surface hover:border-border-light"
                      }`}
                    >
                      <p className={`font-bold ${form.goal === val ? "text-lime" : "text-text-primary"}`}>{label}</p>
                      <p className="text-sm text-text-secondary mt-1">{descriptions[val]}</p>
                    </button>
                  );
                })}
              </div>
              {errors.goal && <p className="text-red-400 text-sm mt-2">{errors.goal}</p>}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="px-5 py-2.5 rounded-xl border border-border text-text-secondary font-medium text-sm hover:border-border-light disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Back
            </button>

            <button
              type="button"
              onClick={next}
              className="px-8 py-2.5 rounded-xl bg-lime text-bg font-bold text-sm hover:bg-lime-dark transition-all"
            >
              {step === TOTAL_STEPS ? "Build my plan →" : "Continue →"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
