# Bowl motion spec (locked)

## Scene A — Main bowl (`BowlScroll`)

**Status: freeze current implementation.**

- Source of truth: `BowlScroll.tsx` inside `petfit yellow.zip` and/or `replicate-3d-bowl-parallax final.zip`.
- Behavior: large, centered bowl; scroll-scrubbed falling-food / fill frame sequence.
- Allowed changes only: Persian PetFit labels, surrounding section colors, remove Freshpet CDN (self-host same frames).
- **Forbidden:** redesigning the bowl mesh/frames, changing timing curve, replacing with a different hero bowl.

## Scene B — Other bowls (`PetFitOrbitBowls`) — new

**Status: design + animate in-house (PR5).**

### Intent

A second theatrical beat after Scene A: several **smaller** bowls dramatize package variety (chicken / turkey / intro) without dog-size chrome.

### Layout

- Stage full-bleed cream/beige.
- 3 bowls (default): enter from **left**, gather at **center**, exit to **right**.
- Scale ≈ 40–55% of Scene A bowl.
- Optional FA callouts above/below each bowl (protein / freshness).

### Visual

- Bowl vessels: brand gold `#F0A830` / orange `#F09048` rims; indigo `#30246C` accents.
- Contents: pack-inspired ingredients (chicken, carrot, potato, pumpkin line-art or photos from assets).
- Optional tiny mascot peek (cat↔dog) as watermark — low opacity.

### Animation

- GSAP + ScrollTrigger scrub (same scroll budget philosophy as Scene A).
- Path: horizontal translate + slight Y bob; stagger 0.08–0.15 progress between bowls.
- `prefers-reduced-motion`: show three static bowls centered, no travel.

### Not

- Do not ship Freshpet `IngredientBowls` art/copy.
- Do not reuse Freshpet frame CDN for Scene B.

## Home order reminder

`Hero → BowlScroll (A) → PetFitOrbitBowls (B) → Ingredients → Brands → Difference → Planet → Reviews → StoreCta`
