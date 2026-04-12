/**
 * OG Image page — a static 1200×630 "card" that mirrors the hero section.
 * Visit /og in dev, or screenshot with `node scripts/generate-og.cjs`.
 * Not registered in production routes.
 */
const OgImage = () => {
  return (
    <div
      style={{ width: 1200, height: 630 }}
      className="relative overflow-hidden bg-foreground text-background flex"
    >
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-gradient-radial from-background/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[350px] bg-gradient-radial from-background/3 to-transparent rounded-full blur-3xl" />

      {/* Giant X watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-chomsky text-[500px] text-background/[0.025] pointer-events-none select-none leading-none">
        X
      </div>

      {/* Left content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center pl-[80px] pr-[40px]">
        {/* Logo + line */}
        <div className="flex items-center gap-4 mb-6">
          <span className="font-chomsky text-[72px] text-background leading-none">
            X
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-background/40 to-transparent" />
        </div>

        {/* Tagline pills */}
        <div className="flex items-center gap-3 text-[13px] tracking-[0.35em] uppercase text-background/50 mb-10">
          <span>Discipline</span>
          <span className="w-[6px] h-[6px] rounded-full bg-background" />
          <span>Intention</span>
          <span className="w-[6px] h-[6px] rounded-full bg-background" />
          <span>Execution</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-[86px] font-medium leading-[0.9] mb-6">
          <span className="text-background">Stop</span>
          <br />
          <span className="text-background/50">drifting.</span>
        </h1>

        {/* Subtext */}
        <p className="text-[20px] text-background/50 leading-relaxed max-w-[440px]">
          A no-nonsense system for people who are done making excuses. Set
          intentions. Execute. Become undeniable.
        </p>
      </div>

      {/* Right card */}
      <div className="relative z-10 flex items-center pr-[80px]">
        <div className="w-[380px]">
          {/* Decorative borders */}
          <div className="absolute -inset-4 border border-background/10 rounded-3xl" />
          <div className="absolute -inset-8 border border-background/5 rounded-3xl" />

          <div className="bg-background/10 backdrop-blur-md border border-background/20 rounded-2xl p-8 relative">
            <div className="text-[12px] uppercase tracking-[0.3em] text-background/50 mb-5">
              Now Live
            </div>

            <h3 className="text-[28px] font-serif text-background mb-3">
              Start free now.
            </h3>

            <p className="text-[14px] text-background/50 mb-6">
              Xenith is open. Build momentum with intentions, focus, and
              projects.
            </p>

            {/* Fake input + button */}
            <div className="flex gap-2 mb-6">
              <div className="flex-1 h-[44px] rounded-lg bg-background/10 border border-background/20 flex items-center px-4">
                <span className="text-[14px] text-background/30">
                  Sign in to continue
                </span>
              </div>
              <div className="h-[44px] px-5 rounded-lg bg-background flex items-center justify-center">
                <span className="text-[14px] font-medium text-foreground">
                  Start →
                </span>
              </div>
            </div>

            {/* Footer badges */}
            <div className="pt-5 border-t border-background/10 flex items-center gap-5 text-[12px] text-background/40">
              <div className="flex items-center gap-2">
                <div className="w-[8px] h-[8px] rounded-full bg-[#22c55e]" />
                <span>Live now</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[8px] h-[8px] rounded-full bg-background" />
                <span>No credit card</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-background/10" />
      <div className="absolute bottom-4 right-[80px] text-[12px] text-background/20 tracking-wider">
        xenith.life
      </div>
    </div>
  );
};

export default OgImage;
