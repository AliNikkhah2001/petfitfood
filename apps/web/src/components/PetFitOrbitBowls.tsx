import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  LOCAL_BOWL_FRAMES,
  ORBIT_BOWLS,
  localBowlFrame,
} from "../lib/localBrand";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scene B — larger bowls travel L → center → R with falling-food frame scrub
 * + floating AI ingredient chips (offline assets).
 */
export default function PetFitOrbitBowls() {
  const rootRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = track.querySelectorAll<HTMLElement>("[data-orbit-bowl]");
    const frameImgs = track.querySelectorAll<HTMLImageElement>("[data-orbit-frame]");
    const chips = track.querySelectorAll<HTMLElement>("[data-orbit-chip]");

    // Prefetch local frames once
    for (let i = 0; i < LOCAL_BOWL_FRAMES; i += 1) {
      const img = new Image();
      img.src = localBowlFrame(i);
    }

    if (reduce) {
      frameImgs.forEach((img) => {
        img.src = localBowlFrame(LOCAL_BOWL_FRAMES - 1);
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(cards, { xPercent: -130, opacity: 0.4, scale: 0.88 });
      gsap.set(chips, { opacity: 0, scale: 0.6, y: -24 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=220%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const frame = Math.min(
              LOCAL_BOWL_FRAMES - 1,
              Math.floor(self.progress * (LOCAL_BOWL_FRAMES - 1)),
            );
            const src = localBowlFrame(frame);
            frameImgs.forEach((img) => {
              if (img.dataset.frame !== String(frame)) {
                img.dataset.frame = String(frame);
                img.src = src;
              }
            });
          },
        },
      });

      tl.to(cards, {
        xPercent: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.1,
        ease: "none",
        duration: 0.4,
      })
        .to(
          chips,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            stagger: 0.04,
            ease: "none",
            duration: 0.25,
          },
          0.25,
        )
        .to(cards, {
          xPercent: 130,
          opacity: 0.45,
          scale: 0.92,
          stagger: 0.08,
          ease: "none",
          duration: 0.4,
        })
        .to(
          chips,
          {
            opacity: 0,
            y: 20,
            stagger: 0.03,
            ease: "none",
            duration: 0.2,
          },
          "-=0.35",
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="orbit-bowls"
      className="relative overflow-hidden bg-secondary-beige"
      aria-label="کاسه‌های پت‌فیت — صحنه دوم"
    >
      <div className="mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center px-4 py-14 md:px-8">
        <p className="eyebrow text-brand-indigo">صحنه دوم · بسته‌ها در حرکت</p>
        <h2 className="mt-3 text-center text-h-4xl text-brand-indigo md:text-h-5xl">
          هر بسته، یک کاسهٔ تازه
        </h2>
        <p className="mt-3 max-w-xl text-center text-p-base text-neutral-600">
          کاسه‌های بزرگ‌تر با ریزش مواد — از چپ وارد می‌شوند، در مرکز می‌مانند و به راست می‌روند.
        </p>

        <div
          ref={trackRef}
          className="relative mt-10 flex w-full max-w-6xl items-end justify-center gap-4 md:gap-8 lg:gap-12"
        >
          {ORBIT_BOWLS.map((bowl) => (
            <div
              key={bowl.id}
              data-orbit-bowl
              className="relative flex w-[38%] max-w-[340px] flex-col items-center gap-4 md:w-[32%]"
            >
              <div className="relative aspect-square w-full">
                {/* Falling-food frame scrub (local) */}
                <img
                  data-orbit-frame
                  src={localBowlFrame(0)}
                  alt=""
                  className="absolute inset-0 h-full w-full rounded-[28%] object-cover shadow-soft"
                  draggable={false}
                />
                {/* AI bowl overlay for brand look */}
                <img
                  src={bowl.bowl}
                  alt={bowl.label}
                  className="absolute inset-[8%] h-[84%] w-[84%] rounded-full object-cover opacity-90 mix-blend-normal shadow-soft ring-4 ring-white/80"
                  draggable={false}
                />

                {bowl.ingredients.map((ing, index) => {
                  const pos =
                    index === 0
                      ? "top-[-4%] start-[-6%]"
                      : index === 1
                        ? "top-[-2%] end-[-8%]"
                        : "bottom-[6%] start-[8%]";
                  return (
                    <div
                      key={`${bowl.id}-${ing.caption}`}
                      data-orbit-chip
                      className={`absolute ${pos} z-10 flex w-[32%] max-w-[110px] flex-col items-center`}
                    >
                      <img
                        src={ing.src}
                        alt=""
                        className="aspect-square w-full rounded-full object-cover shadow-md ring-2 ring-white"
                        draggable={false}
                      />
                      <span className="mt-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-brand-indigo shadow-sm">
                        {ing.caption}
                      </span>
                    </div>
                  );
                })}
              </div>
              <span className="text-center text-p-base font-bold text-brand-indigo md:text-h-lg">
                {bowl.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
