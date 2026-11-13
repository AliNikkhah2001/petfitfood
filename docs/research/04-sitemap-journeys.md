# Sitemap & journeys — revised

## Commerce model

Sell **packages / subscriptions**, not single bowls.  
Filters: **duration** (intro · 7-day · 14-day) · **protein** (chicken · turkey) · **custom**.  
**Dog size (mini/medium/large) is SKU detail on PDP**, not a shop taxonomy tab.

## Sitemap

```text
/                       Home (Arena + Freshpet-section stack + dual bowl scenes)
/subscriptions          Hub: intro / 7-day / 14-day / custom
/shop                   All packages (filter: duration, protein)
/product-category/:slug Duration or protein category
/product/:slug          PDP (size/weight as attribute, not nav)
/cart
/checkout
/about                  داستان ما
/faq
/contact
/magazine               + 3 seeded articles
/magazine/:slug
/privacy
/terms
/login | /register | /account   shells
/*                      404
```

**Nav (aligned with Arena + shop reality):**  
محصولات/اشتراک‌ها · مواد اولیه · چرا پت‌فیت؟ · داستان ما · مجله · تماس  
Utility: جستجو (later) · حساب · سبد  
Header CTA: شروع اشتراک → `/subscriptions`

## Journeys

### J1 — First package

Home → CTA اشتراک → pick intro/7/14/custom → protein → PDP → cart → checkout

### J2 — Learn then buy

مواد اولیه / چرا پت‌فیت / مجله → StoreCta → subscriptions

### J3 — Custom

Subscriptions → اختصاصی → configurator or guided form (exists in catalog)
