"use client";

import { useState } from "react";
import { programs } from "@/lib/workouts";
import type { Program, WorkoutDay } from "@/lib/workouts";

const tagColors: Record<string, string> = {
  STRENGTH: "#C8FF00",
  HIIT: "#F472B6",
  CARDIO: "#60A5FA",
  MOBILITY: "#A78BFA",
};

function ExerciseRow({ ex, i }: { ex: Program["schedule"][0]["exercises"][0]; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-border rounded-xl overflow-hidden cursor-pointer hover:border-border-light transition-colors"
      onClick={() => setOpen(!open)}
    >
      <div className="px-5 py-4 flex items-center justify-between bg-surface">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-text-muted tabular-nums w-5">{i + 1}</span>
          <div>
            <p className="font-semibold">{ex.name}</p>
            <p className="text-sm text-text-secondary mt-0.5">
              {ex.sets} sets · {ex.reps} reps · {ex.rest} rest
            </p>
          </div>
        </div>
        <span className={`text-text-secondary transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </div>
      {open && (
        <div className="px-5 py-4 bg-card border-t border-border">
          <p className="text-sm text-text-secondary italic">&ldquo;{ex.cue}&rdquo;</p>
        </div>
      )}
    </div>
  );
}

function ProgramCard({ program, selected, onSelect }: { program: Program; selected: boolean; onSelect: () => void }) {
  const color = tagColors[program.tag] ?? "#C8FF00";
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-6 rounded-2xl border transition-all ${
        selected ? "border-lime bg-lime/5" : "border-border bg-card hover:border-border-light"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <span
          className="text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
          style={{ color, background: `${color}18` }}
        >
          {program.tag}
        </span>
        <span className="text-xs text-text-muted font-medium">{program.frequency}</span>
      </div>
      <h3 className="text-lg font-black mb-2">{program.name}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{program.description}</p>
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
        <span className="text-xs text-text-muted">{program.days} days/week</span>
        <span className="text-xs text-text-muted">{program.level}</span>
      </div>
    </button>
  );
}

function DayView({ day, color }: { day: WorkoutDay; color: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-border flex items-center justify-between">
        <div>
          <h4 className="font-bold">{day.name}</h4>
          <p className="text-sm text-text-secondary mt-0.5">{day.focus}</p>
        </div>
        <span className="text-sm font-medium px-3 py-1 rounded-full border" style={{ color, borderColor: `${color}40` }}>
          {day.duration}
        </span>
      </div>
      <div className="p-4 space-y-2">
        {day.exercises.map((ex, i) => (
          <ExerciseRow key={ex.name} ex={ex} i={i} />
        ))}
      </div>
    </div>
  );
}

export default function Workouts() {
  const [selectedId, setSelectedId] = useState<string>("strength");
  const [activeDay, setActiveDay] = useState<number>(0);

  const program = programs.find((p) => p.id === selectedId)!;
  const color = tagColors[program.tag] ?? "#C8FF00";

  return (
    <main className="pt-16 min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-lime text-sm font-semibold tracking-widest uppercase mb-2">Programs</p>
          <h1 className="text-4xl font-black">Choose your program.</h1>
          <p className="text-text-secondary mt-2">Four expert-designed protocols. Each built with progressive overload in mind.</p>
        </div>

        {/* Program selector */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {programs.map((p) => (
            <ProgramCard
              key={p.id}
              program={p}
              selected={p.id === selectedId}
              onSelect={() => { setSelectedId(p.id); setActiveDay(0); }}
            />
          ))}
        </div>

        {/* Program detail */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black">{program.name}</h2>
              <p className="text-text-secondary text-sm mt-1">{program.frequency} · {program.level}</p>
            </div>
          </div>

          {/* Day tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {program.schedule.map((day, i) => (
              <button
                key={day.name}
                onClick={() => setActiveDay(i)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                  activeDay === i
                    ? "text-bg border-transparent"
                    : "border-border text-text-secondary hover:text-text-primary hover:border-border-light"
                }`}
                style={activeDay === i ? { background: color, borderColor: color } : {}}
              >
                {day.name}
                <span className="ml-2 text-xs opacity-70">{day.focus.split("—")[0].trim()}</span>
              </button>
            ))}
          </div>

          <DayView day={program.schedule[activeDay]} color={color} />
        </div>
      </div>
    </main>
  );
}
