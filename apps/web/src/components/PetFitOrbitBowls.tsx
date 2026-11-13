import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PRODUCT_BOWL_SHOWS, productBowlFrame } from "../lib/localBrand";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 90;
const IMAGE_SIZE = 1000;
const SOURCE_SIZE = 1200;
const RISE = 313;
const SHOWS = PRODUCT_BOWL_SHOWS;
const SEGMENT = 1 / SHOWS.length;
/** Soft crossfade when protein pack changes (same camera pose). */
const CROSSFADE_MS = 280;

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

type Pack = {
  images: (HTMLImageElement | undefined)[];
  ready: boolean;
};

/**
 * Locked centered vessel (like BowlScroll).
 * One continuous 0→89 camera scrub for the whole section.
 * Protein packs swap at the *same* frame index with a short crossfade —
 * never reset to frame 0 (that looked like “another bowl”).
 */
export default function PetFitOrbitBowls() {
  const rootRef = useRef<HTMLElement | null>(null);
  const areaRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const bowlRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const canvasARef = useRef<HTMLCanvasElement | null>(null);
  const canvasBRef = useRef<HTMLCanvasElement | null>(null);
  const chipsRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLParagraphElement | null>(null);
  const blurbRef = useRef<HTMLParagraphElement | null>(null);
  const packsRef = useRef<Record<string, Pack>>({});
  const activeKeyRef = useRef(SHOWS[0].frameKey);
  const showIdRef = useRef(SHOWS[0].id);
  const drawnRef = useRef(-1);
  const frontIsARef = useRef(true);
  const fadingRef = useRef(false);
  const [active, setActive] = useState(0);
  const [firstReady, setFirstReady] = useState(false);

  const resolveImage = (frameKey: string, index: number) => {
    const images = packsRef.current[frameKey]?.images ?? [];
    let frame = clamp(Math.round(index), 0, FRAME_COUNT - 1);
    let image = images[frame];
    for (let attempt = 0; attempt < FRAME_COUNT; attempt += 1) {
      if (image?.complete && image.naturalWidth > 0) break;
      frame = frame > 0 ? frame - 1 : Math.min(index + attempt + 1, FRAME_COUNT - 1);
      image = images[frame];
    }
    if (!image?.complete || image.naturalWidth === 0) return { frame: -1, image: null };
    return { frame, image };
  };

  const paintOnto = (
    canvas: HTMLCanvasElement | null,
    frameKey: string,
    index: number,
  ) => {
    if (!canvas) return -1;
    const ctx = canvas.getContext("2d");
    if (!ctx) return -1;
    const { frame, image } = resolveImage(frameKey, index);
    if (frame < 0 || !image) return -1;

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
    return frame;
  };

  const frontCanvas = () => (frontIsARef.current ? canvasARef.current : canvasBRef.current);
  const backCanvas = () => (frontIsARef.current ? canvasBRef.current : canvasARef.current);

  const drawFrame = (index: number) => {
    const painted = paintOnto(frontCanvas(), activeKeyRef.current, index);
    if (painted >= 0) drawnRef.current = painted;
  };

  const loadPack = (frameKey: string, onFirst?: () => void) => {
    if (packsRef.current[frameKey]?.ready) {
      onFirst?.();
      return packsRef.current[frameKey];
    }
    const images: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT);
    let loadedCount = 0;
    let started = 0;
    let sawFirst = false;
    const pack: Pack = { images, ready: false };
    packsRef.current[frameKey] = pack;

    const ordered = [
      0,
      44,
      89,
      ...Array.from({ length: FRAME_COUNT }, (_, i) => i).filter(
        (i) => ![0, 44, 89].includes(i),
      ),
    ];

    const kick = () => {
      while (started < ordered.length && started - loadedCount < 8) {
        const index = ordered[started];
        started += 1;
        const image = new Image();
        image.decoding = "async";
        image.onload = () => {
          loadedCount += 1;
          if (!sawFirst) {
            sawFirst = true;
            onFirst?.();
          }
          if (loadedCount >= FRAME_COUNT) pack.ready = true;
          if (activeKeyRef.current === frameKey && !fadingRef.current) {
            drawFrame(drawnRef.current < 0 ? 0 : drawnRef.current);
          }
          kick();
        };
        image.onerror = () => {
          loadedCount += 1;
          kick();
        };
        image.src = productBowlFrame(frameKey, index);
        images[index] = image;
      }
    };
    kick();
    return pack;
  };

  const paintChipsAndCopy = (index: number) => {
    const show = SHOWS[index];
    if (labelRef.current) {
      labelRef.current.textContent = show.label;
      labelRef.current.style.color = show.accent;
    }
    if (blurbRef.current) blurbRef.current.textContent = show.blurb;

    const root = chipsRef.current;
    if (!root) return;
    const nodes = root.querySelectorAll<HTMLElement>("[data-product-chip]");
    nodes.forEach((node, i) => {
      const ing = show.ingredients[i];
      if (!ing) {
        node.style.visibility = "hidden";
        return;
      }
      node.style.visibility = "visible";
      node.dataset.from = String(ing.from);
      node.dataset.rate = String(ing.rate);
      node.dataset.z = String(ing.z);
      node.style.setProperty("--x", ing.x);
      node.style.setProperty("--y", ing.y);
      node.style.setProperty("--size", `${ing.size}px`);
      node.style.setProperty("--rot", ing.rotate);
      node.style.setProperty("--z", `${ing.z}px`);
      const img = node.querySelector("img");
      const cap = node.querySelector("span");
      if (img) img.src = ing.src;
      if (cap) cap.textContent = ing.caption;
    });
  };

  const crossfadeToProtein = (showIndex: number, frameIndex: number) => {
    const show = SHOWS[showIndex];
    showIdRef.current = show.id;
    activeKeyRef.current = show.frameKey;
    loadPack(show.frameKey);
    paintChipsAndCopy(showIndex);
    setActive(showIndex);

    const front = frontCanvas();
    const back = backCanvas();
    if (!front || !back) {
      drawFrame(frameIndex);
      return;
    }

    // Paint next protein at the SAME camera frame, then fade.
    paintOnto(back, show.frameKey, frameIndex);
    fadingRef.current = true;
    gsap.killTweensOf([front, back]);
    gsap.set(back, { opacity: 0, zIndex: 2 });
    gsap.set(front, { opacity: 1, zIndex: 1 });
    gsap.to(back, {
      opacity: 1,
      duration: CROSSFADE_MS / 1000,
      ease: "power1.out",
    });
    gsap.to(front, {
      opacity: 0,
      duration: CROSSFADE_MS / 1000,
      ease: "power1.out",
      onComplete: () => {
        frontIsARef.current = !frontIsARef.current;
        fadingRef.current = false;
        gsap.set(frontCanvas(), { opacity: 1, zIndex: 2 });
        gsap.set(backCanvas(), { opacity: 0, zIndex: 1 });
        drawFrame(frameIndex);
      },
    });
  };

  useEffect(() => {
    loadPack(SHOWS[0].frameKey, () => setFirstReady(true));
    SHOWS.slice(1).forEach((show) => loadPack(show.frameKey));
  }, []);

  useEffect(() => {
    const area = areaRef.current;
    const bowl = bowlRef.current;
    const frame = frameRef.current;
    const chipsRoot = chipsRef.current;
    if (!area || !bowl || !frame || !chipsRoot || !firstReady) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    paintChipsAndCopy(0);
    activeKeyRef.current = SHOWS[0].frameKey;
    showIdRef.current = SHOWS[0].id;

    if (reduce) {
      drawFrame(FRAME_COUNT - 1);
      gsap.set(bowl, { clearProps: "transform", opacity: 1 });
      chipsRoot.querySelectorAll<HTMLElement>("[data-product-chip]").forEach((n) => {
        n.dataset.visible = "true";
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(bowl, {
        x: 0,
        y: 0,
        xPercent: 0,
        yPercent: 0,
        scale: 1,
        rotateX: 0,
        opacity: 1,
        transformOrigin: "50% 50%",
        force3D: true,
        transformPerspective: 1400,
      });
      gsap.set(canvasARef.current, { opacity: 1, zIndex: 2 });
      gsap.set(canvasBRef.current, { opacity: 0, zIndex: 1 });

      const tiltX = gsap.quickTo(frame, "rotationX", {
        duration: 0.4,
        ease: "power2.out",
      });
      const tiltY = gsap.quickTo(frame, "rotationY", {
        duration: 0.4,
        ease: "power2.out",
      });
      const rubberband = (offset: number, limit: number, constant = 0.55) =>
        (offset * limit * constant) / (limit + constant * Math.abs(offset));

      const onPointerMove = (event: PointerEvent) => {
        const rect = frame.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const offsetX = (px - 0.5) * rect.width;
        const offsetY = (py - 0.5) * rect.height;
        const normX = rubberband(offsetX, rect.width / 2) / (rect.width / 2);
        const normY = rubberband(offsetY, rect.height / 2) / (rect.height / 2);
        tiltY(normX * 6);
        tiltX(-normY * 5);
      };
      const onPointerLeave = () => {
        tiltX(0);
        tiltY(0);
      };
      stageRef.current?.addEventListener("pointermove", onPointerMove);
      stageRef.current?.addEventListener("pointerleave", onPointerLeave);

      const applyProgress = (p: number) => {
        // ONE continuous camera scrub for the whole section (never reset to 0).
        const frameIndex = p * (FRAME_COUNT - 1);
        const proteinIndex = Math.min(
          SHOWS.length - 1,
          Math.floor(p / SEGMENT + 1e-9),
        );

        if (showIdRef.current !== SHOWS[proteinIndex].id) {
          crossfadeToProtein(proteinIndex, frameIndex);
        } else if (!fadingRef.current) {
          drawFrame(frameIndex);
        } else {
          // Keep both layers in sync during fade
          paintOnto(frontCanvas(), activeKeyRef.current, frameIndex);
          paintOnto(
            backCanvas(),
            SHOWS[proteinIndex].frameKey,
            frameIndex,
          );
        }

        const current = Math.round(frameIndex);
        drawnRef.current = current;
        chipsRoot.querySelectorAll<HTMLElement>("[data-product-chip]").forEach((node) => {
          if (node.style.visibility === "hidden") return;
          const from = Number(node.dataset.from ?? "20");
          const rate = Number(node.dataset.rate ?? "1");
          const z = Number(node.dataset.z ?? "100");
          node.dataset.visible = String(current >= from);
          const travel = current / (FRAME_COUNT - 1);
          const depthCue = (z / 148) * rate;
          node.style.setProperty(
            "--drift",
            `${((0.5 - travel) * 12 * depthCue).toFixed(2)}px`,
          );
          node.style.setProperty(
            "--drift-x",
            `${((0.5 - travel) * 8 * depthCue).toFixed(2)}px`,
          );
        });
      };

      ScrollTrigger.create({
        trigger: area,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.45,
        invalidateOnRefresh: true,
        onRefresh: (self) => applyProgress(self.progress),
        onUpdate: (self) => applyProgress(self.progress),
      });

      drawFrame(0);
    }, rootRef);

    return () => ctx.revert();
  }, [firstReady]);

  const first = SHOWS[0];

  return (
    <section
      ref={rootRef}
      id="orbit-bowls"
      className="product-bowl-section relative bg-white"
      aria-label="کاسه‌های محصول پت‌فیت"
    >
      <div className="o-container--xl o-container pt-10 md:pt-14">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="eyebrow text-brand-indigo">کاسه‌های محصول</p>
          <h2 className="mt-3 text-h-4xl text-brand-indigo md:text-h-5xl">
            مرغ · گوساله · بوقلمون · ماهی
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-p-base text-neutral-600">
            کاسه و زاویهٔ دوربین ثابت است؛ با اسکرول فقط رنگ و نوع پروتئین نرم عوض می‌شود.
          </p>
        </div>
      </div>

      <div ref={areaRef} className="product-bowl-scroll-area">
        <div className="product-bowl-pin">
          <div ref={stageRef} className="product-bowl-stage">
            <div ref={bowlRef} className="product-bowl-3d">
              <div className="product-bowl-halo" aria-hidden="true" />
              <div ref={frameRef} className="product-bowl-frame">
                <canvas
                  ref={canvasARef}
                  className="product-bowl-canvas"
                  width={IMAGE_SIZE}
                  height={IMAGE_SIZE}
                  role="img"
                  aria-label="کاسهٔ محصول پت‌فیت"
                />
                <canvas
                  ref={canvasBRef}
                  className="product-bowl-canvas product-bowl-canvas--back"
                  width={IMAGE_SIZE}
                  height={IMAGE_SIZE}
                  aria-hidden="true"
                />
              </div>

              <div ref={chipsRef} className="product-bowl-photos" aria-hidden="true">
                {Array.from({ length: 4 }, (_, i) => {
                  const ing = first.ingredients[i];
                  return (
                    <div
                      key={i}
                      data-product-chip
                      data-from={ing?.from ?? 22}
                      data-rate={ing?.rate ?? 1}
                      data-z={ing?.z ?? 100}
                      data-visible="false"
                      className="product-bowl-photo"
                      style={
                        {
                          "--x": ing?.x ?? "50%",
                          "--y": ing?.y ?? "50%",
                          "--size": `${ing?.size ?? 80}px`,
                          "--rot": ing?.rotate ?? "0deg",
                          "--z": `${ing?.z ?? 80}px`,
                        } as React.CSSProperties
                      }
                    >
                      <img src={ing?.src ?? ""} alt="" draggable={false} />
                      <span>{ing?.caption ?? ""}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <p ref={labelRef} className="product-bowl-label" style={{ color: first.accent }}>
              {first.label}
            </p>
            <p ref={blurbRef} className="product-bowl-blurb">
              {first.blurb}
            </p>

            <div className="product-bowl-dots" aria-hidden="true">
              {SHOWS.map((show, i) => (
                <span
                  key={show.id}
                  className={i === active ? "is-active" : undefined}
                  style={i === active ? { backgroundColor: show.accent } : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
