# PR1 — Asset inventory

Brand target: **PetFit / پت‌فیت**. Do not ship Dodo or Freshpet marks in production UI.

## Reuse (production candidates)

| Asset | Path | Notes |
| --- | --- | --- |
| Catalog JSON | `petfit/raw_data/products.json` (15) | Rename brand strings دودو→پت‌فیت on import |
| Categories | `petfit/raw_data/product_categories.json` (7) | intro / 7-day / 14-day / custom + size filters |
| Pages / posts | `petfit/raw_data/pages.json`, `posts.json` | Reword titles; keep FA magazine topics |
| Media index | `petfit/raw_data/media.json` (175) | Map to local files; drop Optimole hotlinks |
| Pack photography | `petfit/wp_temp_assets/uploads/2026/06/` (`P1–P6`, `S1–S6`, `00*.jpg`, `01-2.jpg`…) | Primary product imagery |
| Extra heroes | `…/2026/07/AAA*.png`, `AAB*.jpg` | Lifestyle / hero candidates |
| Fonts | `petfit/wp_temp_assets/uploads/fonts/Vazirmatn-*.woff2` | Body + UI |
| **Official logo** | `brand/logo/petfit-logo-catdog.png` | **Canonical** — cat↔dog + indigo PetFit |
| **Pack labels** | `brand/packaging/petfit-label-*.png` | Palette + icons + trust badges |
| Old placeholder wordmark | `pet not fit/clone/petfit/assets/logo-petfit.svg` | **Do not ship** (purple gradient) |
| Favicon / banner placeholders | same clone folder | Replace with mascot crop from official logo |
| Bowl parallax code | `petfit yellow.zip` → `BowlScroll.tsx` | Self-host frames; strip Freshpet CDN |
| Embedded hero imgs | yellow zip `src/lib/images.data.ts` | Optional offline hero set |

## Reference only (do not ship as-is)

| Asset | Why |
| --- | --- |
| `petfit/frontend/` HTML mirror | WP dump; IA/content reference |
| `logo-dodo*.png` | Competitor brand |
| Freshpet logos / green-only clones | Competitor brand |
| `pet not fit/.../product-1..6.jpg` | Wikimedia stock; attribution required; prefer real pack shots |
| Payment plugin logos (SnappPay, Digipay, TorobPay) | Integration reference for later PR9 |

## Must remake / acquire

1. PetFit logo in hybrid palette (green leaf + amber accent).
2. Self-hosted bowl frame sequence (~90 WebP) — currently Freshpet CDN in prototypes.
3. Open Graph / PWA icons at 192 / 512.
4. FA microcopy pass replacing دودو / دودوپت everywhere.

## Catalog snapshot (commerce)

- 12 subscription SKUs (chicken/turkey × mini/medium/large × 7/14-day)
- 2 intro packs (chicken, turkey)
- 1 custom subscription (price 0 — configurator later)
- Currency in dump: **IRT** (تومان display in UI)
