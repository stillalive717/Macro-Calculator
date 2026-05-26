"use client";

import { useState, useEffect } from "react";
import type { Profile } from "@/lib/macros";
import { calculateMacros, goalLabels, activityLabels } from "@/lib/macros";
import Link from "next/link";

interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tdee: number;
  bmr: number;
}

interface Logged {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const macroColors = {
  protein: "#C8FF00",
  carbs: "#60A5FA",
  fat: "#F472B6",
};

function Ring({ value, max, color, size = 120 }: { value: number; max: number; color: string; size?: number }) {
  const radius = (size - 16) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const dash = pct * circ;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#222222" strokeWidth={8} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
    </svg>
  );
}

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [targets, setTargets] = useState<MacroTargets | null>(null);
  const [logged, setLogged] = useState<Logged>({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [input, setInput] = useState({ calories: "", protein: "", carbs: "", fat: "" });
  const [tab, setTab] = useState<"macros" | "stats">("macros");

  useEffect(() => {
    const p = localStorage.getItem("fck_profile");
    const m = localStorage.getItem("fck_macros");
    const l = localStorage.getItem("fck_logged_today");
    if (p) setProfile(JSON.parse(p));
    if (m) setTargets(JSON.parse(m));
    if (l) setLogged(JSON.parse(l));
  }, []);

  function logMacros() {
    const added = {
      calories: logged.calories + Number(input.calories || 0),
      protein: logged.protein + Number(input.protein || 0),
      carbs: logged.carbs + Number(input.carbs || 0),
      fat: logged.fat + Number(input.fat || 0),
    };
    setLogged(added);
    localStorage.setItem("fck_logged_today", JSON.stringify(added));
    setInput({ calories: "", protein: "", carbs: "", fat: "" });
  }

  function resetDay() {
    const zero = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    setLogged(zero);
    localStorage.setItem("fck_logged_today", JSON.stringify(zero));
  }

  if (!profile || !targets) {
    return (
      <main className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-6">🎯</div>
          <h1 className="text-3xl font-black mb-3">No plan yet.</h1>
          <p className="text-text-secondary mb-8">Complete the onboarding to get your personalized macro targets.</p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-lime text-bg font-bold hover:bg-lime-dark transition-all"
          >
            Build my plan →
          </Link>
        </div>
      </main>
    );
  }

  const remaining = {
    calories: Math.max(0, targets.calories - logged.calories),
    protein: Math.max(0, targets.protein - logged.protein),
    carbs: Math.max(0, targets.carbs - logged.carbs),
    fat: Math.max(0, targets.fat - logged.fat),
  };

  const caloriePct = Math.round((logged.calories / targets.calories) * 100);

  return (
    <main className="pt-16 min-h-screen bg-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-lime text-sm font-semibold tracking-widest uppercase mb-1">Dashboard</p>
            <h1 className="text-4xl font-black">Hey, {profile.name}.</h1>
            <p className="text-text-secondary mt-1">
              {goalLabels[profile.goal]} · {targets.calories} kcal target
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetDay}
              className="px-4 py-2 text-sm font-medium border border-border text-text-secondary rounded-xl hover:border-border-light transition-colors"
            >
              Reset day
            </button>
            <Link
              href="/onboarding"
              className="px-4 py-2 text-sm font-medium border border-border text-text-secondary rounded-xl hover:border-border-light transition-colors"
            >
              Edit profile
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border border-border rounded-xl p-1 w-fit bg-surface">
          {(["macros", "stats"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                tab === t ? "bg-card text-lime" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "macros" && (
          <div className="space-y-6">
            {/* Calorie ring + summary */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-2xl p-8 flex items-center gap-8">
                <div className="relative">
                  <Ring value={logged.calories} max={targets.calories} color="#C8FF00" size={140} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black">{caloriePct}%</span>
                    <span className="text-xs text-text-secondary">of goal</span>
                  </div>
                </div>
                <div>
                  <p className="text-text-secondary text-sm font-medium mb-1">Calories</p>
                  <p className="text-4xl font-black tabular-nums">{logged.calories.toLocaleString()}</p>
                  <p className="text-text-secondary text-sm mt-1">of {targets.calories.toLocaleString()} kcal</p>
                  <p className="text-lime text-sm font-semibold mt-3">{remaining.calories.toLocaleString()} remaining</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {(["protein", "carbs", "fat"] as const).map((macro) => (
                  <div key={macro} className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center gap-3">
                    <div className="relative">
                      <Ring value={logged[macro]} max={targets[macro]} color={macroColors[macro]} size={80} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold">
                          {Math.min(100, Math.round((logged[macro] / targets[macro]) * 100))}%
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: macroColors[macro] }}>
                        {macro}
                      </p>
                      <p className="text-lg font-black tabular-nums mt-0.5">{logged[macro]}g</p>
                      <p className="text-xs text-text-secondary">/ {targets[macro]}g</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Log food */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-lg font-bold mb-6">Log a meal</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {(["calories", "protein", "carbs", "fat"] as const).map((key) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-2">
                      {key} {key !== "calories" ? "(g)" : "(kcal)"}
                    </label>
                    <input
                      type="number"
                      value={input[key]}
                      onChange={(e) => setInput((i) => ({ ...i, [key]: e.target.value }))}
                      placeholder="0"
                      min={0}
                      className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-lime transition-colors tabular-nums"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={logMacros}
                className="px-6 py-2.5 rounded-xl bg-lime text-bg font-bold text-sm hover:bg-lime-dark transition-all"
              >
                Add to today
              </button>
            </div>

            {/* Remaining table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-bold">Today&apos;s breakdown</h2>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["Macro", "Target", "Logged", "Remaining"].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Calories", target: targets.calories, logged: logged.calories, remaining: remaining.calories, unit: "kcal", color: "#C8FF00" },
                    { label: "Protein", target: targets.protein, logged: logged.protein, remaining: remaining.protein, unit: "g", color: macroColors.protein },
                    { label: "Carbs", target: targets.carbs, logged: logged.carbs, remaining: remaining.carbs, unit: "g", color: macroColors.carbs },
                    { label: "Fat", target: targets.fat, logged: logged.fat, remaining: remaining.fat, unit: "g", color: macroColors.fat },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
                      <td className="px-6 py-4 font-semibold" style={{ color: row.color }}>{row.label}</td>
                      <td className="px-6 py-4 text-text-secondary tabular-nums">{row.target.toLocaleString()} {row.unit}</td>
                      <td className="px-6 py-4 font-semibold tabular-nums">{row.logged.toLocaleString()} {row.unit}</td>
                      <td className="px-6 py-4 tabular-nums">
                        <span className={row.remaining === 0 ? "text-lime font-bold" : "text-text-primary"}>
                          {row.remaining.toLocaleString()} {row.unit}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "stats" && (
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-lg font-bold mb-6">Your profile</h2>
              <dl className="space-y-4">
                {[
                  { label: "Name", value: profile.name },
                  { label: "Age", value: `${profile.age} years` },
                  { label: "Sex", value: profile.sex.charAt(0).toUpperCase() + profile.sex.slice(1) },
                  { label: "Weight", value: `${profile.weightKg} kg` },
                  { label: "Height", value: `${profile.heightCm} cm` },
                  { label: "Activity", value: activityLabels[profile.activity].split("(")[0].trim() },
                  { label: "Goal", value: goalLabels[profile.goal] },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <dt className="text-text-secondary text-sm">{item.label}</dt>
                    <dd className="font-semibold text-sm">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-lg font-bold mb-6">Energy breakdown</h2>
              <dl className="space-y-4">
                {[
                  { label: "BMR", value: `${targets.bmr.toLocaleString()} kcal`, note: "Basal metabolic rate" },
                  { label: "TDEE", value: `${targets.tdee.toLocaleString()} kcal`, note: "Total daily energy expenditure" },
                  { label: "Target", value: `${targets.calories.toLocaleString()} kcal`, note: `${goalLabels[profile.goal]}`, highlight: true },
                  { label: "Protein", value: `${targets.protein}g / ${targets.protein * 4} kcal`, note: "2.2g per kg bodyweight" },
                  { label: "Carbs", value: `${targets.carbs}g / ${targets.carbs * 4} kcal`, note: "Remaining calories" },
                  { label: "Fat", value: `${targets.fat}g / ${targets.fat * 9} kcal`, note: "0.9g per kg bodyweight" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-start py-2 border-b border-border last:border-0">
                    <div>
                      <dt className={`text-sm font-semibold ${item.highlight ? "text-lime" : "text-text-primary"}`}>{item.label}</dt>
                      <dd className="text-xs text-text-muted mt-0.5">{item.note}</dd>
                    </div>
                    <dd className={`font-bold text-sm tabular-nums ${item.highlight ? "text-lime" : ""}`}>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="sm:col-span-2 bg-card border border-border rounded-2xl p-8">
              <h2 className="text-lg font-bold mb-4">Next steps</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { href: "/workouts", icon: "💪", title: "Start your program", body: "Choose from 4 expert-programmed workout plans." },
                  { href: "/coach", icon: "🤖", title: "Ask your AI coach", body: "Get answers on training, nutrition, or recovery." },
                  { href: "/onboarding", icon: "🔄", title: "Update your stats", body: "Rerun the calculator as your body changes." },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="p-5 rounded-xl border border-border bg-surface hover:border-lime/30 transition-colors group"
                  >
                    <span className="text-2xl block mb-3">{item.icon}</span>
                    <p className="font-bold mb-1 group-hover:text-lime transition-colors">{item.title}</p>
                    <p className="text-sm text-text-secondary">{item.body}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
