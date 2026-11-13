import { HERO_POSTER } from "../lib/assets";

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="petfit-hero relative flex max-h-[940px] min-h-[560px] w-full items-end overflow-hidden bg-neutral-800"
    >
      <img
        src={HERO_POSTER}
        alt="دوستی که برای سگش غذای تازه آماده می‌کند"
        className="hero-zoom absolute inset-0 h-full w-full object-cover object-[58%_44%]"
        fetchPriority="high"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(350deg, rgba(31,28,20,0.76) 0%, rgba(31,28,20,0.1) 62%, rgba(31,28,20,0.05) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-full bg-gradient-to-l from-black/45 via-black/12 to-transparent md:w-4/5"
      />

      <div className="relative z-10 w-full pb-14 md:pb-20 lg:pb-16">
        <div className="o-container--xl o-container flex flex-col items-center justify-end text-center">
          <h1 id="hero-heading" className="sr-only">
            پت‌فیت — غذای گرم و تازه برای پت شما
          </h1>
          <p className="mx-auto max-w-[540px] text-sm leading-8 font-medium text-white/90 md:text-base">
            بسته‌های اشتراکی بالانس‌شده از پروتئین واقعی — دم در، بدون دردسر خرید تک‌وعده‌ای.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:mt-7">
            <a
              href="#our-brands"
              className="inline-flex items-center justify-center rounded-full bg-brand-orange-hot px-6 py-[13.5px] text-p-sm font-semibold text-white transition-colors hover:bg-primary-600"
            >
              شروع اشتراک
            </a>
            <a href="#find-store" className="a-button px-6 py-[13.5px]">
              پیدا کردن فروشگاه
            </a>
            <a
              href="#how-its-made"
              className="inline-flex items-center gap-2 text-p-sm font-semibold text-white/90 underline decoration-white/40 underline-offset-4 transition-colors hover:text-white"
            >
              ترکیبات را ببینید
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8h10m0 0-4-4m4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/75 lg:flex"
      >
        <span className="text-[10px] font-bold">پایین‌تر</span>
        <span className="h-8 w-[1px] bg-gradient-to-b from-white/70 to-transparent" />
      </div>
    </section>
  );
}
