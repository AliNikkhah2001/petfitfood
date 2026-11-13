import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { asset } from "../lib/asset";
gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 90;
const IMAGE_SIZE = 1000;
const SOURCE_SIZE = 1200;
const RISE = 313;

/** Offline-first frame sequence (downloaded into public/frames/bowl). */
const frameUrl = (index: number) =>
  asset(`frames/bowl/${String(index + 1).padStart(5, "0")}.webp`);



type BowlLabel = {
  frame: number;
  text: string;
  side: "left" | "right";
  startTop: number;
  endTop: number;
  mobileTop: number;
};

const LABELS: BowlLabel[] = [
  {
    frame: 24,
    text: "هویج، کدو حلوایی، کدو سبز و سیب‌زمینی",
    side: "left",
    startTop: 37,
    endTop: 31,
    mobileTop: 30,
  },
  {
    frame: 31,
    text: "مرغ، گوساله یا بوقلمون + دل و جگر مرغ",
    side: "right",
    startTop: 48,
    endTop: 42,
    mobileTop: 49,
  },
  {
    frame: 38,
    text: "پخت ملایم — بدون نگهدارنده مصنوعی",
    side: "left",
    startTop: 59,
    endTop: 53,
    mobileTop: 68,
  },
];

type IngredientPhoto = {
  src: string;
  caption: string;
  x: string;
  y: string;
  size: number;
  rotate: string;
  from: number;
  /** depth in px inside the preserve-3d stage; larger = nearer the viewer */
  z: number;
  /** independent scroll-parallax rate, so layers separate as you scroll */
  rate: number;
};

/* Ingredient photography floats at separate depths around the product bowl. */
const PHOTOS: IngredientPhoto[] = [
  {
    src: asset("/brand/ingredients/carrots.jpg"),
    caption: "هویج",
    x: "32%",
    y: "23%",
    size: 100,
    rotate: "-7deg",
    from: 22,
    z: 96,
    rate: 0.95,
  },
  {
    src: asset("/brand/ingredients/chicken.jpg"),
    caption: "مرغ تازه",
    x: "68%",
    y: "19%",
    size: 108,
    rotate: "8deg",
    from: 29,
    z: 148,
    rate: 1.25,
  },
  {
    src: asset("/brand/ingredients/pumpkin.jpg"),
    caption: "کدو حلوایی",
    x: "30%",
    y: "82%",
    size: 90,
    rotate: "6deg",
    from: 36,
    z: 64,
    rate: 0.7,
  },
  {
    src: asset("/brand/ingredients/organs.jpg"),
    caption: "دل و جگر",
    x: "70%",
    y: "80%",
    size: 90,
    rotate: "-6deg",
    from: 44,
    z: 118,
    rate: 1.05,
  },
];

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));
const faNumber = (value: number, digits = 1) =>
  new Intl.NumberFormat("fa-IR", {
    minimumIntegerDigits: digits,
    useGrouping: false,
  }).format(value);

export default function BowlScroll() {
  const areaRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const bowlRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const haloRef = useRef<HTMLDivElement | null>(null);
  const glossRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const counterFillRef = useRef<HTMLElement | null>(null);
  const counterTextRef = useRef<HTMLSpanElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const drawnRef = useRef(-1);

  const [loaded, setLoaded] = useState(0);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [ready, setReady] = useState(false);

  /* ------------------------------------------------------------------ *
   * Frame loader uses a priority queue so the bowl appears immediately:
   * frame 1, final frame, then the full sequence with limited concurrency.
   * ------------------------------------------------------------------ */
  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    let loadedCount = 0;
    let started = 0;
    let firstReady = false;

    const queue = Array.from({ length: FRAME_COUNT }, (_, i) => i);
    const priority = [0, 44, 89];
    const ordered = [
      ...priority,
      ...queue.filter((i) => !priority.includes(i)),
    ];

    const finishOne = () => {
      if (cancelled) return;
      loadedCount += 1;
      setLoaded(loadedCount);
      if (loadedCount >= FRAME_COUNT || loadedCount >= 24) setReady(true);
    };

    const kick = () => {
      while (started < ordered.length && started - loadedCount < 8) {
        const index = ordered[started];
        started += 1;
        const image = new Image();
        image.decoding = "async";
        image.onload = () => {
          finishOne();
          kick();
          if (!firstReady) {
            firstReady = true;
            setFirstFrameReady(true);
            drawFrame(0);
          } else if (!cancelled) {
            // keep the canvas honest if the reader is already mid-scroll
            drawFrame(drawnRef.current < 0 ? 0 : drawnRef.current);
          }
        };
        image.onerror = () => {
          finishOne();
          kick();
        };
        image.src = frameUrl(index);
        images[index] = image;
      }
    };

    imagesRef.current = images;
    kick();

    const timeout = window.setTimeout(() => {
      if (!cancelled) setReady(true);
    }, 7000);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, []);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = clamp(Math.round(index), 0, FRAME_COUNT - 1);
    let image = imagesRef.current[frame];
    // fall back to the nearest decoded frame while the sequence streams in
    for (let attempt = 0; attempt < FRAME_COUNT; attempt += 1) {
      if (image?.complete && image.naturalWidth > 0) break;
      frame = frame > 0 ? frame - 1 : Math.min(index + attempt + 1, FRAME_COUNT - 1);
      image = imagesRef.current[frame];
    }
    if (!image?.complete || image.naturalWidth === 0) return;

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const rise = -((RISE / SOURCE_SIZE) * 100) * (frame / FRAME_COUNT);
    const y = (IMAGE_SIZE * ((RISE / SOURCE_SIZE) * 100 + rise)) / 100;

    ctx.clearRect(0, 0, IMAGE_SIZE, IMAGE_SIZE);
    if (mobile) {
      ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        -0.25 * IMAGE_SIZE,
        y,
        1.5 * IMAGE_SIZE,
        IMAGE_SIZE,
      );
    } else {
      ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        y,
        IMAGE_SIZE,
        IMAGE_SIZE,
      );
    }
    drawnRef.current = frame;
  };

  const paintOverlay = (frame: number) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const current = reduce
      ? FRAME_COUNT - 1
      : clamp(Math.round(frame), 0, FRAME_COUNT - 1);

    /* Grounding: the shadow tightens as the bowl reaches the end of its
     * rise, so the object reads as landing rather than floating. */
    const settle = current / (FRAME_COUNT - 1);
    shadowRef.current?.style.setProperty("--ground", settle.toFixed(3));

    LABELS.forEach((label, index) => {
      const node = labelRefs.current[index];
      if (!node) return;
      const startFrame = mobile ? label.frame + 12 : label.frame;
      const visible = current >= startFrame;
      const progress = clamp(
        (current - startFrame) / Math.max(1, FRAME_COUNT - startFrame - 18),
      );
      const top = label.startTop + (label.endTop - label.startTop) * progress;
      node.dataset.visible = String(visible);
      node.style.setProperty("--label-top", `${mobile ? label.mobileTop : top}%`);
      node.style.setProperty("--label-lift", `${-10 * progress}px`);
    });

    PHOTOS.forEach((photo, index) => {
      const node = photoRefs.current[index];
      if (!node) return;
      node.dataset.visible = String(current >= photo.from);

      /* Each layer travels at its own rate, and its horizontal offset is
       * derived from its Z depth — that separation is what turns a flat
       * scroll into readable parallax. */
      const travel = current / (FRAME_COUNT - 1);
      const depthCue = (photo.z / 148) * photo.rate;
      node.style.setProperty("--drift", `${((0.5 - travel) * 30 * depthCue).toFixed(2)}px`);
      node.style.setProperty("--drift-x", `${((0.5 - travel) * 18 * depthCue).toFixed(2)}px`);
    });

    if (counterFillRef.current) {
      counterFillRef.current.style.width = `${Math.round((current / (FRAME_COUNT - 1)) * 100)}%`;
    }
    if (counterTextRef.current) {
      counterTextRef.current.textContent = `${faNumber(current + 1, 2)} / ${faNumber(FRAME_COUNT, 2)}`;
    }
    if (hintRef.current) {
      hintRef.current.style.opacity = current > 2 ? "0" : "1";
    }
  };

  /* ------------------------------------------------------------------ *
   * GSAP ScrollTrigger: frame scrub (with physical easing), overlay
   * reveal, and a scroll-linked 3D dolly of the bowl. Pointer movement
   * tilts a separate inner layer so the two never fight over transforms.
   * ------------------------------------------------------------------ */
  useEffect(() => {
    const area = areaRef.current;
    const bowl = bowlRef.current;
    const frame = frameRef.current;
    if (!area || !bowl || !frame) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduce) {
      drawFrame(FRAME_COUNT - 1);
      paintOverlay(FRAME_COUNT);
      return;
    }

    const counter = { frame: 0 };
    const overlay = { frame: 0 };

    /* Fast scrubbing gets a whisper of blur. Real objects smear when they
     * move quickly; the blur encodes speed without strobing. A single rAF
     * decay owns the value so it always eases back to razor sharp. */
    let lastFrame = 0;
    let blurValue = 0;
    let blurRaf = 0;
    const canvasEl = canvasRef.current;
    const renderBlur = () => {
      canvasEl?.style.setProperty("--speed-blur", `${blurValue.toFixed(2)}px`);
      if (blurValue > 0.02) {
        blurValue *= 0.86;
        blurRaf = requestAnimationFrame(renderBlur);
      } else {
        blurValue = 0;
        canvasEl?.style.setProperty("--speed-blur", "0px");
        blurRaf = 0;
      }
    };
    const kickSpeedBlur = (delta: number) => {
      blurValue = Math.min(2.2, Math.max(blurValue, Math.abs(delta) * 0.26));
      if (!blurRaf) blurRaf = requestAnimationFrame(renderBlur);
    };

    const scrub = gsap.to(counter, {
      frame: FRAME_COUNT - 1,
      ease: "none",
      onUpdate: () => {
        const rounded = Math.round(counter.frame);
        kickSpeedBlur(rounded - lastFrame);
        lastFrame = rounded;
        drawFrame(rounded);
        paintOverlay(counter.frame);
      },
      scrollTrigger: {
        trigger: area,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.45,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          drawFrame(Math.round(self.progress * (FRAME_COUNT - 1)));
          paintOverlay(Math.round(self.progress * (FRAME_COUNT - 1)));
        },
      },
    });

    const reveal = gsap.to(overlay, {
      frame: FRAME_COUNT - 1,
      ease: "none",
      onUpdate: () => {
        overlay.frame = counter.frame;
        paintOverlay(overlay.frame);
      },
      scrollTrigger: {
        trigger: area,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
      },
    });

    const dolly = gsap.fromTo(
      bowl,
      { scale: 0.9, rotateX: 11, y: 44, transformPerspective: 1400 },
      {
        scale: 1.03,
        rotateX: 0,
        y: -10,
        ease: "none",
        scrollTrigger: {
          trigger: area,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
        },
      },
    );

    /* ---- pointer tilt ------------------------------------------------ *
     * Every layer below re-targets from its live on-screen value, so a
     * pointer entering mid-motion never snaps. quickTo keeps an active
     * tween and re-targets it — that is what makes this interruptible.   */
    const tiltX = gsap.quickTo(frame, "rotationX", {
      // damping 1.0 / response 0.4 — critically damped, no overshoot
      duration: 0.4,
      ease: "power2.out",
    });
    const tiltY = gsap.quickTo(frame, "rotationY", {
      duration: 0.4,
      ease: "power2.out",
    });
    const glossX = glossRef.current
      ? gsap.quickTo(glossRef.current, "x", {
          duration: 0.5,
          ease: "power2.out",
        })
      : null;
    const glossY = glossRef.current
      ? gsap.quickTo(glossRef.current, "y", {
          duration: 0.5,
          ease: "power2.out",
        })
      : null;
    const haloDrift = haloRef.current
      ? gsap.quickTo(haloRef.current, "x", {
          duration: 0.6,
          ease: "power2.out",
        })
      : null;

    const MAX_TILT = 9;

    /* Rubber-band: near the centre the object follows 1:1; the further the
     * pointer travels, the less it follows. Continuous resistance reads as
     * "there is nothing more here" instead of a hard mechanical clamp.    */
    const rubberband = (offset: number, limit: number, constant = 0.55) =>
      (offset * limit * constant) / (limit + constant * Math.abs(offset));

    const onPointerMove = (event: PointerEvent) => {
      const rect = frame.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      // signed offset from centre in px, then rubber-banded inside the limit
      const offsetX = (px - 0.5) * rect.width;
      const offsetY = (py - 0.5) * rect.height;
      const normX = rubberband(offsetX, rect.width / 2) / (rect.width / 2);
      const normY = rubberband(offsetY, rect.height / 2) / (rect.height / 2);

      stage?.setAttribute("data-engaged", "true");
      tiltY(normX * MAX_TILT);
      tiltX(-normY * MAX_TILT * 0.8);
      haloDrift?.(normX * 26);
      // highlight travels opposite the light source for a convincing sheen
      glossX?.(normX * -46);
      glossY?.(normY * -34);
    };

    const onPointerLeave = () => {
      stage?.setAttribute("data-engaged", "false");
      tiltX(0);
      tiltY(0);
      haloDrift?.(0);
      glossX?.(0);
      glossY?.(0);
    };

    const stage = stageRef.current;
    stage?.addEventListener("pointermove", onPointerMove);
    stage?.addEventListener("pointerleave", onPointerLeave);
    ScrollTrigger.refresh();

    return () => {
      if (blurRaf) cancelAnimationFrame(blurRaf);
      canvasEl?.style.setProperty("--speed-blur", "0px");
      scrub.scrollTrigger?.kill();
      scrub.kill();
      reveal.scrollTrigger?.kill();
      reveal.kill();
      dolly.scrollTrigger?.kill();
      dolly.kill();
      stage?.removeEventListener("pointermove", onPointerMove);
      stage?.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  useEffect(() => {
    if (firstFrameReady) {
      drawFrame(0);
      paintOverlay(0);
    }
  }, [firstFrameReady]);

  const loadingPercent = Math.round((loaded / FRAME_COUNT) * 100);

  return (
    <section
      id="how-its-made"
      aria-labelledby="ingredients-heading"
      className="bowl-section bg-white"
    >
      <div className="o-container--xl o-container pt-16 md:pt-24">
        <div className="mx-auto max-w-[860px] text-center">
          <p className="eyebrow">از مواد اولیه تا کاسه</p>
          <h2
            id="ingredients-heading"
            className="mt-3 text-h-3xl leading-[1.15] text-neutral-700 md:text-h-5xl"
          >
            هر وعده‌ی پت‌فیت با پروتئین باکیفیت و سبزیجات تازه شروع می‌شود.
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-p-sm font-medium text-neutral-500 md:text-p-base">
            مواد اولیه‌ی واقعی که با دقت آماده می‌شوند. پایین بروید و ترکیب هر کاسه را ببینید.
          </p>
        </div>
      </div>

      <div ref={areaRef} className="bowl-scroll-area">
        <div className="bowl-pin">
          <div ref={stageRef} className="bowl-stage">
            <div ref={bowlRef} className="bowl-3d">
              <div ref={haloRef} className="bowl-halo" aria-hidden="true" />
              <div ref={shadowRef} className="bowl-shadow" aria-hidden="true" />

              <div ref={frameRef} className="bowl-frame">
                <canvas
                  ref={canvasRef}
                  width={IMAGE_SIZE}
                  height={IMAGE_SIZE}
                  role="img"
                  aria-label="کاسه‌ی پت‌فیت با پروتئین، سبزیجات و میوه‌های تازه که با پیمایش صفحه کامل می‌شود"
                />
                <div ref={glossRef} className="bowl-gloss" aria-hidden="true" />
              </div>

              <div className="bowl-photos" aria-hidden="true">
                {PHOTOS.map((photo, index) => (
                  <div
                    key={photo.caption}
                    ref={(node) => {
                      photoRefs.current[index] = node;
                    }}
                    className="bowl-photo"
                    data-visible="false"
                    data-caption={photo.caption}
                    style={
                      {
                        "--x": photo.x,
                        "--y": photo.y,
                        "--size": `${photo.size}px`,
                        "--rot": photo.rotate,
                        "--z": `${photo.z}px`,
                        "--z-near": (photo.z / 148).toFixed(3),
                      } as React.CSSProperties
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.src}
                      alt=""
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>


              <div className="bowl-skeleton" data-hidden={firstFrameReady}>
                <img
                  src={frameUrl(FRAME_COUNT - 1)}
                  alt=""
                  aria-hidden="true"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="bowl-loading" data-ready={ready}>
                <span className="bowl-loading__label">آماده‌سازی کاسه</span>
                <span className="bowl-loading__bar">
                  <span
                    className="bowl-loading__fill"
                    style={{ width: `${loadingPercent}%` }}
                  />
                </span>
                <span className="text-[10px] font-semibold text-neutral-500">
                  {faNumber(loadingPercent)}٪
                </span>
              </div>
            </div>

            <div className="bowl-labels" aria-live="polite">
              {LABELS.map((label, index) => (
                <div
                  key={label.text}
                  ref={(node) => {
                    labelRefs.current[index] = node;
                  }}
                  className="bowl-label"
                  data-side={label.side}
                  data-visible="false"
                >
                  <p className="bowl-label__text">{label.text}</p>
                  <span className="bowl-label__rule" aria-hidden="true" />
                  <span className="bowl-label__dot" aria-hidden="true" />
                </div>
              ))}
            </div>

            <div className="bowl-scroll-hint" ref={hintRef}>
              <span>برای دیدن ترکیبات، پایین بروید</span>
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                <path
                  d="M6 1v11m0 0 4.5-4.5M6 12 1.5 7.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="bowl-counter" aria-hidden="true">
              <span className="bowl-counter__track">
                <span ref={counterFillRef} className="bowl-counter__fill" />
              </span>
              <span ref={counterTextRef} className="bowl-counter__label">
                ۰۱ / ۹۰
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="o-container--xl o-container pb-16 md:pb-20">
        <div className="mx-auto flex max-w-[980px] flex-col items-center justify-between gap-4 rounded-[24px] border border-neutral-200 bg-secondary-off-white px-6 py-5 text-center md:flex-row md:text-left">
          <p className="text-p-sm font-semibold text-neutral-700 md:text-p-base">
            بدون افزودنی‌های غیرضروری؛ فقط غذای تازه و متعادل برای سگ‌ها و گربه‌ها.
          </p>
          <a href="#our-brands" className="a-button-outline">
            دیدن محصولات پت‌فیت
          </a>
        </div>
      </div>
    </section>
  );
}
