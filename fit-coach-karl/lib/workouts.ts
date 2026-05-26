export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  cue: string;
}

export interface WorkoutDay {
  name: string;
  focus: string;
  duration: string;
  exercises: Exercise[];
}

export interface Program {
  id: string;
  name: string;
  tag: string;
  description: string;
  days: number;
  frequency: string;
  level: string;
  schedule: WorkoutDay[];
}

export const programs: Program[] = [
  {
    id: "strength",
    name: "Strength Foundation",
    tag: "STRENGTH",
    description: "Progressive overload protocol. Build raw strength across the 5 major movement patterns.",
    days: 4,
    frequency: "4x / week",
    level: "Intermediate",
    schedule: [
      {
        name: "Day 1",
        focus: "Lower — Squat",
        duration: "60 min",
        exercises: [
          { name: "Barbell Back Squat", sets: 5, reps: "5", rest: "3 min", cue: "Break at hips and knees simultaneously. Drive knees out." },
          { name: "Romanian Deadlift", sets: 3, reps: "8-10", rest: "2 min", cue: "Hinge at hips, soft knee bend, bar stays close." },
          { name: "Leg Press", sets: 3, reps: "10-12", rest: "90 sec", cue: "Full range, don't lock knees at top." },
          { name: "Walking Lunges", sets: 3, reps: "12 each", rest: "90 sec", cue: "Upright torso, 90° at both knees." },
          { name: "Calf Raises", sets: 4, reps: "15-20", rest: "60 sec", cue: "Full stretch at bottom, pause at top." },
        ],
      },
      {
        name: "Day 2",
        focus: "Upper — Push",
        duration: "55 min",
        exercises: [
          { name: "Barbell Bench Press", sets: 5, reps: "5", rest: "3 min", cue: "Arch naturally, tuck elbows 45°, touch chest." },
          { name: "Overhead Press", sets: 3, reps: "8", rest: "2 min", cue: "Lock glutes, press straight up, bar over mid-foot." },
          { name: "Incline DB Press", sets: 3, reps: "10-12", rest: "90 sec", cue: "30° incline, full stretch at bottom." },
          { name: "Lateral Raises", sets: 4, reps: "15", rest: "60 sec", cue: "Lead with elbows, slight forward lean." },
          { name: "Tricep Dips", sets: 3, reps: "10-12", rest: "90 sec", cue: "Lean forward slightly for chest emphasis." },
        ],
      },
      {
        name: "Day 3",
        focus: "Lower — Hinge",
        duration: "65 min",
        exercises: [
          { name: "Conventional Deadlift", sets: 5, reps: "3-5", rest: "3-4 min", cue: "Bar over mid-foot, lats tight, push floor away." },
          { name: "Hack Squat", sets: 3, reps: "8-10", rest: "2 min", cue: "Full depth, heels elevated slightly." },
          { name: "Good Mornings", sets: 3, reps: "10", rest: "90 sec", cue: "Soft knees, neutral spine, hinge deep." },
          { name: "Nordic Hamstring Curl", sets: 3, reps: "6-8", rest: "2 min", cue: "Control the descent — every rep matters." },
          { name: "Hip Abductor Machine", sets: 3, reps: "15", rest: "60 sec", cue: "Squeeze at full abduction." },
        ],
      },
      {
        name: "Day 4",
        focus: "Upper — Pull",
        duration: "55 min",
        exercises: [
          { name: "Weighted Pull-Ups", sets: 5, reps: "5", rest: "3 min", cue: "Dead hang start, chest to bar." },
          { name: "Barbell Row", sets: 4, reps: "6-8", rest: "2 min", cue: "Flat back, pull to lower chest, squeeze lats." },
          { name: "Seated Cable Row", sets: 3, reps: "10-12", rest: "90 sec", cue: "Neutral grip, full stretch each rep." },
          { name: "Face Pulls", sets: 4, reps: "15", rest: "60 sec", cue: "Elbows high, pull to forehead." },
          { name: "EZ Bar Curl", sets: 3, reps: "10-12", rest: "90 sec", cue: "Elbows pinned, no swing." },
        ],
      },
    ],
  },
  {
    id: "hiit",
    name: "HIIT & Conditioning",
    tag: "HIIT",
    description: "High-intensity intervals for maximum fat burn and cardiovascular output. No wasted time.",
    days: 3,
    frequency: "3x / week",
    level: "All levels",
    schedule: [
      {
        name: "Session 1",
        focus: "Lower Body Power",
        duration: "35 min",
        exercises: [
          { name: "Jump Squats", sets: 4, reps: "30 sec on / 15 sec off", rest: "60 sec between rounds", cue: "Land softly, absorb impact through hips." },
          { name: "Box Jumps", sets: 4, reps: "8", rest: "45 sec", cue: "Full extension at top, step down." },
          { name: "Lateral Bounds", sets: 3, reps: "10 each side", rest: "45 sec", cue: "Stick the landing, single leg balance." },
          { name: "Kettlebell Swings", sets: 4, reps: "15", rest: "45 sec", cue: "Hinge, not squat. Power from hips." },
          { name: "Sprint Intervals", sets: 6, reps: "20 sec max effort", rest: "40 sec walk", cue: "True max effort. Hold nothing back." },
        ],
      },
      {
        name: "Session 2",
        focus: "Upper Body Metabolic",
        duration: "30 min",
        exercises: [
          { name: "Push-Up Variations", sets: 4, reps: "45 sec", rest: "15 sec", cue: "Rotate types: standard, wide, diamond, pike." },
          { name: "Renegade Rows", sets: 4, reps: "8 each side", rest: "45 sec", cue: "Hips square, row to hip not armpit." },
          { name: "Battle Ropes", sets: 4, reps: "30 sec", rest: "30 sec", cue: "Alternate arms, engage core throughout." },
          { name: "TRX Row", sets: 3, reps: "12", rest: "30 sec", cue: "Body rigid, pull chest to handles." },
          { name: "Plank-to-Downdog", sets: 3, reps: "10", rest: "30 sec", cue: "Controlled breath, full hip extension." },
        ],
      },
      {
        name: "Session 3",
        focus: "Full Body Tabata",
        duration: "28 min",
        exercises: [
          { name: "Burpees", sets: 8, reps: "20 sec / 10 sec rest", rest: "1 min after 8 rounds", cue: "Maintain form under fatigue. Chest to floor." },
          { name: "Mountain Climbers", sets: 8, reps: "20 sec / 10 sec rest", rest: "1 min after 8 rounds", cue: "Drive knees to opposite elbow." },
          { name: "Squat Thrusters", sets: 8, reps: "20 sec / 10 sec rest", rest: "1 min after 8 rounds", cue: "Squat deep, press overhead at full extension." },
          { name: "High Knees", sets: 8, reps: "20 sec / 10 sec rest", rest: "1 min after 8 rounds", cue: "Drive arms, knees to hip height." },
        ],
      },
    ],
  },
  {
    id: "cardio",
    name: "Endurance Engine",
    tag: "CARDIO",
    description: "Zone 2 base building and aerobic capacity. The foundation every serious athlete needs.",
    days: 5,
    frequency: "5x / week",
    level: "All levels",
    schedule: [
      {
        name: "Monday",
        focus: "Zone 2 Steady State",
        duration: "45 min",
        exercises: [
          { name: "Easy Run / Cycle", sets: 1, reps: "45 min", rest: "N/A", cue: "Keep heart rate 130-150 BPM. Conversational pace." },
          { name: "Dynamic Cooldown", sets: 1, reps: "10 min", rest: "N/A", cue: "Hip circles, leg swings, slow walk." },
        ],
      },
      {
        name: "Wednesday",
        focus: "Tempo Run",
        duration: "40 min",
        exercises: [
          { name: "10 min Warmup Run", sets: 1, reps: "10 min", rest: "N/A", cue: "Easy pace, HR 130-140." },
          { name: "Tempo Intervals", sets: 4, reps: "5 min hard / 2 min easy", rest: "N/A", cue: "Comfortably hard — 7/10 effort." },
          { name: "5 min Cooldown", sets: 1, reps: "5 min", rest: "N/A", cue: "Walk or very light jog." },
        ],
      },
      {
        name: "Friday",
        focus: "Long Slow Distance",
        duration: "60-90 min",
        exercises: [
          { name: "Long Run / Ride", sets: 1, reps: "60-90 min", rest: "N/A", cue: "Never above Zone 2. Fueling at 45 min mark." },
        ],
      },
    ],
  },
  {
    id: "mobility",
    name: "Mobility & Recovery",
    tag: "MOBILITY",
    description: "Structured flexibility and joint health work. How you recover determines how you grow.",
    days: 3,
    frequency: "3x / week",
    level: "All levels",
    schedule: [
      {
        name: "Session 1",
        focus: "Hip & Lower Body",
        duration: "40 min",
        exercises: [
          { name: "90/90 Hip Stretch", sets: 3, reps: "2 min each side", rest: "30 sec", cue: "Sit tall, lean into stretch without rounding." },
          { name: "Pigeon Pose", sets: 3, reps: "2 min each side", rest: "30 sec", cue: "Square hips, breathe into resistance." },
          { name: "Couch Stretch", sets: 3, reps: "90 sec each", rest: "30 sec", cue: "Drive hip to floor, brace core." },
          { name: "Hamstring Flow", sets: 3, reps: "10 slow reps", rest: "30 sec", cue: "Hinge slowly, reach for floor, stand up." },
          { name: "Deep Squat Hold", sets: 3, reps: "60 sec", rest: "30 sec", cue: "Use doorframe if needed. Heels flat." },
        ],
      },
      {
        name: "Session 2",
        focus: "Spine & Thoracic",
        duration: "35 min",
        exercises: [
          { name: "Cat-Cow Flow", sets: 3, reps: "12 reps", rest: "20 sec", cue: "Full spinal flexion and extension, breath-led." },
          { name: "Thread the Needle", sets: 3, reps: "8 each side", rest: "20 sec", cue: "Reach long, shoulder to floor." },
          { name: "Thoracic Rotation", sets: 3, reps: "10 each side", rest: "20 sec", cue: "Elbow to ceiling, open chest." },
          { name: "Child's Pose with Reach", sets: 3, reps: "90 sec", rest: "20 sec", cue: "Alternate reaching each arm, breathe deeply." },
          { name: "Doorframe Chest Opener", sets: 3, reps: "60 sec", rest: "20 sec", cue: "Two heights: arms at 90° and raised overhead." },
        ],
      },
    ],
  },
];
