# Design system — logo + pack locked

## Brand files

- Logo: [`../../brand/logo/petfit-logo-catdog.png`](../../brand/logo/petfit-logo-catdog.png)
- Packs: [`../../brand/packaging/`](../../brand/packaging/)
- Tokens: [`../research/03-brand-brief.md`](../research/03-brand-brief.md)

## Principles

1. Orange/gold carry warmth; indigo carries wordmark/authority; cream grounds.
2. Always prefer the official PNG logo over redrawn purple placeholders.
3. Pack panel logic can theme SKUs (chicken→orange/blue, beef→red/blue).
4. Rainbow stripe = rare divider accent, not a theme.
5. Home motion: dual bowl block is mandatory (see Motion).

## Motion (locked)

| Scene | Component | Rule |
| --- | --- | --- |
| A — Main | `BowlScroll` | **Keep exactly** as current yellow/`final` prototype (large centered falling-food frames). Rebrand labels/copy only. |
| B — Others | `PetFitOrbitBowls` (new) | **Design + animate ourselves**: smaller bowls, horizontal L→center→R, PetFit gold/orange/indigo + pack ingredient art. Not a Freshpet asset copy. |

## Components

| Component | Spec |
| --- | --- |
| Logo | Full lockup in header (height ~40–56px); favicon = mascot crop |
| Button primary | `brand-orange-hot` / white |
| Button secondary | `brand-indigo` / white or outline indigo |
| Button warm | `brand-gold` / ink |
| Header | cream/white; logo PNG; indigo nav links; orange cart badge |
| Product card | pack photo; orange price; indigo title |
| Trust row | reuse pack circular icons (no preservatives, vet, veg, slow cook) |
| Badge 90/10/0 | from pack infographic language |

## Do not

- Use `pet not fit/clone` purple gradient SVG as production logo
- Flood UI with pack rainbow
- Drop indigo (it’s in the official wordmark)
