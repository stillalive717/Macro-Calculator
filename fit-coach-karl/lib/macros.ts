export type Sex = "male" | "female";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
export type Goal = "cut" | "maintain" | "bulk";

export interface Profile {
  name: string;
  age: number;
  weightKg: number;
  heightCm: number;
  sex: Sex;
  activity: ActivityLevel;
  goal: Goal;
}

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const goalAdjustments: Record<Goal, number> = {
  cut: -500,
  maintain: 0,
  bulk: 300,
};

export function calculateMacros(profile: Profile) {
  const { age, weightKg, heightCm, sex, activity, goal } = profile;

  const bmr =
    sex === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const tdee = bmr * activityMultipliers[activity];
  const targetCalories = Math.round(tdee + goalAdjustments[goal]);

  const proteinG = Math.round(weightKg * 2.2);
  const fatG = Math.round(weightKg * 0.9);
  const proteinCals = proteinG * 4;
  const fatCals = fatG * 9;
  const carbCals = targetCalories - proteinCals - fatCals;
  const carbG = Math.max(0, Math.round(carbCals / 4));

  return {
    calories: targetCalories,
    protein: proteinG,
    carbs: carbG,
    fat: fatG,
    tdee: Math.round(tdee),
    bmr: Math.round(bmr),
  };
}

export const activityLabels: Record<ActivityLevel, string> = {
  sedentary: "Sedentary (desk job, no exercise)",
  light: "Lightly active (1-3 days/week)",
  moderate: "Moderately active (3-5 days/week)",
  active: "Very active (6-7 days/week)",
  very_active: "Extremely active (physical job + training)",
};

export const goalLabels: Record<Goal, string> = {
  cut: "Lose fat",
  maintain: "Maintain weight",
  bulk: "Build muscle",
};
