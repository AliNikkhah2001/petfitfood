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

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

type Pack = {
  images: (HTMLImageElement | undefined)[];
  ready: boolean;
};

/**
 * Locked camera scrub like BowlScroll, but each protein uses an edited
 * frame pack (chicken / beef / turkey / fish food colors).
 */
export default function PetFitOrbitBowls() {
  const rootRef = useRef<HTMLElement | null>(null);
  const areaRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const bowlRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chipsRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLParagraphElement | null>(null);
  const blurbRef = useRef<HTMLParagraphElement | null>(null);
  const packsRef = useRef<Record<string, Pack>>({});
  const activeKeyRef = useRef(SHOWS[0].frameKey);
  const showIdRef = useRef(SHOWS[0].id);
  const drawnRef = useRef(-1);
  const [active, setActive] = useState(0);
  const [firstReady, setFirstReady] = useState(false);

  const currentImages = () =>
    packsRef.current[activeKeyRef.current]?.images ?? [];

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images = currentImages();
    let frame = clamp(Math.round(index), 0, FRAME_COUNT - 1);
    let image = images[frame];
    for (let attempt = 0; attempt < FRAME_COUNT; attempt += 1) {
      if (image?.complete && image.naturalWidth > 0) break;
      frame = frame > 0 ? frame - 1 : Math.min(index + attempt + 1, FRAME_COUNT - 1);
      image = images[frame];
    }
    if (!image?.complete || image.naturalWidth === 0) return;

    const rise = -((RISE / SOURCE_SIZE) * 100) * (frame / FRAME_COUNT);
    const y = (rise / 100) * IMAGE_SIZE;

    ctx.clearRect(0, 0, IMAGE_SIZE, IMAGE_SIZE);
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
    drawnRef.current = frame;
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
          if (activeKeyRef.current === frameKey) {
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

  const paintShow = (index: number) => {
    const show = SHOWS[index];
    showIdRef.current = show.id;
    activeKeyRef.current = show.frameKey;
    loadPack(show.frameKey);
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

  useEffect(() => {
    loadPack(SHOWS[0].frameKey, () => setFirstReady(true));
    // Prefetch the rest so protein swaps stay smooth
    SHOWS.slice(1).forEach((show) => loadPack(show.frameKey));
  }, []);

  useEffect(() => {
    const area = areaRef.current;
    const bowl = bowlRef.current;
    const frame = frameRef.current;
    const chipsRoot = chipsRef.current;
    if (!area || !bowl || !frame || !chipsRoot || !firstReady) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    paintShow(0);

    if (reduce) {
      drawFrame(FRAME_COUNT - 1);
      gsap.set(bowl, { xPercent: 0, scale: 1, rotateX: 0, opacity: 1 });
      chipsRoot.querySelectorAll<HTMLElement>("[data-product-chip]").forEach((n) => {
        n.dataset.visible = "true";
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(bowl, {
        xPercent: -110,
        scale: 0.9,
        rotateX: 10,
        opacity: 0.85,
        transformPerspective: 1400,
      });

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
        tiltY(normX * 8);
        tiltX(-normY * 6.5);
      };
      const onPointerLeave = () => {
        tiltX(0);
        tiltY(0);
      };
      stageRef.current?.addEventListener("pointermove", onPointerMove);
      stageRef.current?.addEventListener("pointerleave", onPointerLeave);

      ScrollTrigger.create({
        trigger: area,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;
          const index = Math.min(SHOWS.length - 1, Math.floor(p / SEGMENT));
          const local = (p - index * SEGMENT) / SEGMENT;

          if (showIdRef.current !== SHOWS[index].id) {
            paintShow(index);
            setActive(index);
          }

          let xPercent = 0;
          let opacity = 1;
          let scale = 1;
          let rotateX = 0;
          let frameProgress = 0;

          if (local < 0.16) {
            const t = local / 0.16;
            xPercent = gsap.utils.interpolate(-110, 0, t);
            opacity = gsap.utils.interpolate(0.7, 1, t);
            scale = gsap.utils.interpolate(0.9, 0.96, t);
            rotateX = gsap.utils.interpolate(10, 6, t);
            frameProgress = 0;
          } else if (local < 0.78) {
            const t = (local - 0.16) / 0.62;
            xPercent = 0;
            opacity = 1;
            scale = gsap.utils.interpolate(0.96, 1.02, t);
            rotateX = gsap.utils.interpolate(6, 0, t);
            frameProgress = t;
          } else {
            const t = (local - 0.78) / 0.22;
            xPercent = gsap.utils.interpolate(0, 110, t);
            opacity = gsap.utils.interpolate(1, 0.7, t);
            scale = gsap.utils.interpolate(1.02, 0.92, t);
            rotateX = gsap.utils.interpolate(0, -3, t);
            frameProgress = 1;
          }

          gsap.set(bowl, { xPercent, opacity, scale, rotateX });
          drawFrame(frameProgress * (FRAME_COUNT - 1));

          const current = Math.round(frameProgress * (FRAME_COUNT - 1));
          chipsRoot.querySelectorAll<HTMLElement>("[data-product-chip]").forEach((node) => {
            if (node.style.visibility === "hidden") return;
            const from = Number(node.dataset.from ?? "20");
            const rate = Number(node.dataset.rate ?? "1");
            const z = Number(node.dataset.z ?? "100");
            const visible = current >= from;
            node.dataset.visible = String(visible);
            const travel = frameProgress;
            const depthCue = (z / 148) * rate;
            node.style.setProperty(
              "--drift",
              `${((0.5 - travel) * 28 * depthCue).toFixed(2)}px`,
            );
            node.style.setProperty(
              "--drift-x",
              `${((0.5 - travel) * 16 * depthCue).toFixed(2)}px`,
            );
          });
        },
      });
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
            همان زاویه و حرکت کاسهٔ بالا — محتوای هر کاسه برای مرغ، گوساله، بوقلمون و ماهی جداست.
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
                  ref={canvasRef}
                  width={IMAGE_SIZE}
                  height={IMAGE_SIZE}
                  role="img"
                  aria-label="کاسهٔ محصول پت‌فیت"
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
