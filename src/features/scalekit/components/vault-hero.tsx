import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";

const valuePoints = [
  "Secure checkout",
  "Verified product access",
  "Support within 24 hours",
];

export default function VaultHero() {
  return (
    <section className="relative flex min-h-[calc(100svh-78px)] items-center overflow-hidden bg-[#040506] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 18% 20%, rgba(0,100,224,0.14) 0%, transparent 30%), radial-gradient(circle at 82% 24%, rgba(230,21,37,0.10) 0%, transparent 28%), linear-gradient(180deg, #050607 0%, #020304 100%)",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div
          className="absolute left-1/2 top-[42%] h-[440px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[130px]"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,100,224,0.55), rgba(83,0,217,0.22), rgba(230,21,37,0.36))",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1180px] text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-[#0064E0]" />

          <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/70 sm:text-sm">
            Digital tools built for execution
          </p>
        </div>

        <h1 className="mx-auto mt-7 max-w-[1050px] text-5xl font-medium leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl md:text-7xl lg:text-[5.7rem]">
          Research smarter. Optimize faster.{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #E61525 0%, #FF6570 26%, #8BB8FF 62%, #0064E0 100%)",
            }}
          >
            Grow with ScaleKit.
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-[790px] text-base font-medium leading-8 text-white/68 sm:text-lg sm:leading-9">
          Access practical tools for product research, SEO, performance,
          conversion, automation, integrations, and technical execution— created
          to help you make better decisions and move from strategy to measurable
          growth faster.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-xl bg-[#E61525] px-8 text-sm font-medium text-white shadow-[0_16px_38px_rgba(230,21,37,0.24)] transition hover:-translate-y-0.5 hover:bg-[#CF1020] sm:w-auto"
          >
            Explore Products
            <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
          </Link>

          <Link
            href="#vault-faq"
            className="inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-[#0064E0] px-8 text-sm font-medium text-white shadow-[0_16px_38px_rgba(0,100,224,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0057C7] sm:w-auto"
          >
            How ScaleKit Works
            <ChevronRight className="h-4 w-4" strokeWidth={1.9} />
          </Link>
        </div>

        <div className="mx-auto mt-9 flex max-w-[760px] flex-col items-center justify-center gap-3 text-sm text-white/58 sm:flex-row sm:flex-wrap sm:gap-x-6">
          {valuePoints.map((point) => (
            <div key={point} className="flex items-center gap-2">
              <CheckCircle2
                className="h-4 w-4 text-[#6DA9FF]"
                strokeWidth={1.9}
              />

              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
