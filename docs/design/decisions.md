# Design & product decisions log

## Locked

| ID | Decision | Source |
| --- | --- | --- |
| D1 | Visual: **orange + gold dominant** + **indigo** from official logo; green thin accent only | Design review + brand assets |
| D2 | Brand: PetFit / پت‌فیت — logo `brand/logo/petfit-logo-catdog.png` | User assets 2026-11-12 |
| D17 | Pack labels are palette/iconography source (`brand/packaging/*`) | User assets |
| D18 | Contacts: petfitfood.ir · Instagram Petfit_food | From pack art |
| D19 | Mascot = official cat↔dog character (Q3 locked) | Logo asset |
| D3 | CMS: Wagtail headless (Django) | PR1 research |
| D4 | Not WordPress; inspired by Freshpet *structure*, PetFit brand | User brief + Arena sample |
| D5 | Long dual-scene bowl motion (see D9) | User Q9 |
| D5a | Scene A main bowl = **exact current BowlScroll** (no redesign of animation) | User 2026-11-12 |
| D5b | Scene B other bowls = **new PetFit design + animation** (smaller, L→C→R) | User 2026-11-12 |
| D6 | Design gate before PR3+ | User brief |
| D20 | Overall design direction OK — proceed with Figma + bowl notes | User 2026-11-12 |
| D21 | Post-bowl sections = yellow/Arena stack (Ingredients→StoreCta) in brand colors | User 2026-11-12 |
| D22 | Design approved — proceed PR3+ | User 2026-11-12 |
| D7 | Home section stack follows yellow + `final` prototypes + [Arena sample](https://01a162b7-37c1-7a22-898e-1b2d0594274e.arena.site/) | User review |
| D8 | Commerce axes: **package type / duration / protein** — **not dog size** | User Q5 |
| D9 | Parallax: (1) large centered falling-food bowl · (2) smaller horizontal bowls L→center→R | User Q9 |
| D10 | Tagline FA: **غذای گرم و تازه، اینبار برای کوچولوت** | User Q1 |
| D11 | Primary CTA → `/subscriptions` | User Q4 |
| D12 | Custom subscription **included** at launch | User Q6 |
| D13 | Magazine v1: index + 3 seeded posts | User Q12 → B |
| D14 | Design review: HTML board **and** Figma | User Q20 → both |
| D14a | Figma file: https://www.figma.com/design/LTJzqftN9IF0pd0Y0Wz0px | Created 2026-11-12 |
| D15 | Hero slider: **A/B test both** (single hero vs 2–3 slides) | User Q10 |
| D16 | Mascot: **official PetFit cat↔dog** (supersedes A/B/C tests) | Logo delivered |

## Answered this round

| Q | Answer |
| --- | --- |
| Q1 | غذای گرم و تازه، اینبار برای کوچولوت |
| Q3 | Locked to official logo mascot |
| Q4 | `/subscriptions` |
| Q5 | Size irrelevant (packages, not single bowls) — drop size filters from IA |
| Q6 | Custom: we have it → ship in catalog/nav |
| Q9 | Long: scene A big falling food; scene B smaller horizontal bowls |
| Q10 | Test both |
| Q12 | B |
| Q20 | Both |

## Still open (defaults apply)

- **Q2** EN tagline on lockup? — Default **No**
- **Q7** Price digits — Default **Persian + تومان**
- **Q8** Payment gateway — Default **Decide later (D)**
- **Q11** Promo top bar — Default **No** (Arena has a soft announcement bar — confirm if you want that style without “٪۱۰”)
- **Q13** WhatsApp — Default **Both**
- **Q14** IG **Petfit_food** + site **petfitfood.ir** locked from pack; phone still placeholder unless provided
- **Q15** Auth shells — Default **B**
- **Q16** PWA prompt — Default **B**
- **Q17** Radius soft — Default **A**
- **Q18** Pack on cream — Default **A**
- **Q19** Tokens — **superseded**: use yellow/orange set in `03-brand-brief.md` (not the green-heavy hybrid)

## Prototype sources of truth (sections)

1. Live: https://01a162b7-37c1-7a22-898e-1b2d0594274e.arena.site/
2. Code: `petfit yellow.zip`, `replicate-3d-bowl-parallax final.zip` (+ sibling replicate zips)
3. Home order (Freshpet-inspired):

```text
Header
Hero (+ optional A/B slider)
BowlScroll          ← scene A: large centered falling food
IngredientBowls     ← scene B: smaller horizontal bowls travel
Ingredients
Brands / product family
Difference (چرا پت‌فیت؟)
Planet / story beat
Reviews
StoreCta → /subscriptions
Footer
```
