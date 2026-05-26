import Link from "next/link";

const features = [
  {
    icon: "⚡",
    title: "Precision Macros",
    body: "Calculated from your TDEE, goal, and body composition. Not generic. Yours.",
  },
  {
    icon: "🤖",
    title: "AI Coach",
    body: "Ask anything. Form checks, meal advice, motivation. Available 24/7.",
  },
  {
    icon: "📈",
    title: "Smart Workouts",
    body: "Four programs. Progressive overload built in. Track every session.",
  },
];

const stats = [
  { value: "4", label: "Programs" },
  { value: "AI", label: "Powered Coach" },
  { value: "100%", label: "Personalized" },
  { value: "0", label: "Wasted Reps" },
];

const steps = [
  { n: "01", title: "Tell us about yourself", body: "Age, weight, height, activity level, and goal. Takes 90 seconds." },
  { n: "02", title: "Get your blueprint", body: "Exact calorie and macro targets calculated from your TDEE. Updated as you change." },
  { n: "03", title: "Train with purpose", body: "Follow your program, track macros, and ask your AI coach anything." },
];

export default function Home() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#C8FF00 1px, transparent 1px), linear-gradient(90deg, #C8FF00 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow blob */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06] blur-[120px]"
          style={{ background: "#C8FF00" }}
        />

        <div className="relative max-w-6xl mx-auto px-6 py-32 w-full">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-lime/30 bg-lime/5 text-lime text-xs font-semibold tracking-wider uppercase mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
              AI-Powered Fitness Coaching
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6">
              <span className="text-text-primary block">Train smarter.</span>
              <span className="text-text-primary block">Eat with precision.</span>
              <span className="text-lime block">Look different.</span>
            </h1>

            <p className="text-xl text-text-secondary max-w-2xl leading-relaxed mb-12">
              Fit Coach Karl combines calculated macro targets, expert workout programming,
              and an AI coach that actually knows your body. No guessing. No plateaus.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-lime text-bg font-bold text-lg hover:bg-lime-dark transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Start for free
                <span className="text-bg/70">→</span>
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-border bg-surface text-text-primary font-semibold text-lg hover:border-border-light hover:bg-card transition-all"
              >
                View dashboard
              </Link>
            </div>
          </div>

          {/* Floating stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-24">
            {stats.map((s) => (
              <div key={s.label} className="p-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
                <p className="text-3xl font-black text-lime tabular-nums">{s.value}</p>
                <p className="text-sm text-text-secondary mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <p className="text-lime text-sm font-semibold tracking-widest uppercase mb-4">What you get</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
              Everything you need.<br />
              <span className="text-text-secondary font-normal">Nothing you don&apos;t.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-8 rounded-2xl border border-border bg-card hover:border-lime/30 transition-colors group"
              >
                <div className="text-4xl mb-6">{f.icon}</div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-lime transition-colors">{f.title}</h3>
                <p className="text-text-secondary leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 border-t border-border bg-surface/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <p className="text-lime text-sm font-semibold tracking-widest uppercase mb-4">The process</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight">Three steps to results.</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.n} className="relative">
                <span className="text-[80px] font-black text-lime/10 leading-none block mb-4">{s.n}</span>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-text-secondary leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 border-t border-border">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-5xl sm:text-6xl font-black tracking-tight mb-6">
            Ready to start?
          </h2>
          <p className="text-xl text-text-secondary mb-12 max-w-lg mx-auto">
            Your personalized macro targets and workout plan are 90 seconds away.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-xl bg-lime text-bg font-bold text-xl hover:bg-lime-dark transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Build my plan
            <span className="text-bg/70">→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lime font-bold">FCK</span>
            <span className="text-text-muted text-sm">Fit Coach Karl</span>
          </div>
          <p className="text-text-muted text-sm">Precision coaching. Zero excuses.</p>
        </div>
      </footer>
    </main>
  );
}
