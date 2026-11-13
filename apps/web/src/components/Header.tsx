import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { PRODUCTS as CATALOG, formatToman } from "../data/catalog";
import { useAuth } from "../lib/auth";
import { useCart } from "../lib/cart";
import Logo from "./Logo";
import PersonalizeOverlay, { PERSONALIZE_STORAGE_KEY } from "./PersonalizeOverlay";

type Panel = "products" | "guide" | null;

const NAV: { label: string; to: string; panel?: Panel }[] = [
  { label: "فروشگاه", to: "/shop" },
  { label: "اشتراک‌ها", to: "/subscriptions" },
  { label: "محصولات", to: "/#our-brands", panel: "products" },
  { label: "مواد اولیه", to: "/#ingredients" },
  { label: "چرا پت‌فیت؟", to: "/#difference" },
  { label: "داستان ما", to: "/about" },
  { label: "مجله", to: "/magazine" },
  { label: "تماس", to: "/contact" },
  { label: "راهنمای تغذیه", to: "/#how-its-made", panel: "guide" },
];

const PRODUCTS = CATALOG.slice(0, 4).map((p) => ({
  title: p.nameFa,
  copy: p.description,
  image: p.image,
  href: `/product/${p.slug}`,
}));

export default function Header() {
  const location = useLocation();
  const { itemCount, totalToman } = useCart();
  const { customer, token } = useAuth();
  const accountLabel =
    token && customer
      ? customer.name?.trim() || customer.phone
      : "حساب";
  const [scrolled, setScrolled] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [promo, setPromo] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openPanel, setOpenPanel] = useState<Panel>(null);
  const [unlocked, setUnlocked] = useState(false);
  // Always show personalize gate on every page load / refresh
  const [gateOpen, setGateOpen] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      const doc = document.documentElement;
      const bottom =
        y + window.innerHeight >= Math.max(doc.scrollHeight, doc.offsetHeight) - 120;
      setAtBottom(bottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--petfit-header-height",
      promo ? "108px" : "72px",
    );
  }, [promo]);

  useEffect(() => {
    const lock = gateOpen;
    document.documentElement.style.overflow = lock ? "hidden" : "";
    document.body.style.overflow = lock ? "hidden" : "";

    const block = (event: Event) => {
      if (gateOpen) event.preventDefault();
    };
    if (lock) {
      window.addEventListener("wheel", block, { passive: false });
      window.addEventListener("touchmove", block, { passive: false });
      window.scrollTo(0, 0);
    }
    return () => {
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [gateOpen]);

  useEffect(() => {
    if (gateOpen) return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, gateOpen]);

  const closeAll = () => {
    setMobileOpen(false);
    setOpenPanel(null);
    setSearchOpen(false);
  };

  const dismissGate = useCallback(() => {
    setUnlocked(true);
    setGateOpen(false);
  }, []);

  const unlockWithForm = useCallback(
    (payload: {
      phone: string;
      dog: { name: string; weight: string; breed: string };
      cat: { name: string; weight: string; breed: string };
    }) => {
      try {
        sessionStorage.setItem(
          PERSONALIZE_STORAGE_KEY,
          JSON.stringify({ ...payload, at: Date.now() }),
        );
      } catch {
        /* ignore quota */
      }
      setUnlocked(true);
      setGateOpen(false);
    },
    [],
  );

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    closeAll();
    if (/مواد|ترکیب|مرغ|هویج|اسفناج/.test(searchTerm)) {
      window.location.assign("/#ingredients");
      return;
    }
    window.location.assign("/shop");
  };

  const menuTop = promo ? 108 : 72;
  const compactLogo = atBottom && unlocked;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {promo && (
          <div className="relative bg-secondary-light-leaf">
            <div className="o-container flex h-[36px] items-center justify-center gap-2 pe-7 text-center">
              <p className="truncate text-[10px] font-semibold text-brand-indigo sm:text-p-xs">
                غذای گرم و تازه، اینبار برای کوچولوت — غذای شخصی‌سازی‌شده
              </p>
            </div>
            <button
              type="button"
              aria-label="بستن پیام"
              onClick={() => setPromo(false)}
              className="absolute top-1/2 start-4 -translate-y-1/2 p-1 text-brand-indigo/70"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="m1.5 1.5 9 9m0-9-9 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        )}

        <div
          className={`relative border-b border-neutral-200/80 bg-white/95 backdrop-blur-md transition-shadow duration-300 ${
            scrolled ? "shadow-[0_8px_24px_-18px_rgba(48,36,108,0.28)]" : ""
          }`}
        >
          <div className="o-container flex min-h-[72px] items-center justify-between gap-3 py-2">
            <Link
              to="/"
              aria-label="صفحه‌ی نخست پت‌فیت"
              className="flex shrink-0 items-center transition-all duration-300"
              onClick={closeAll}
            >
              {compactLogo ? (
                <Logo variant="wordmark" className="text-[28px] md:text-[31px]" />
              ) : (
                <Logo className="h-20 w-auto md:h-24 lg:h-[7.5rem]" />
              )}
            </Link>

            <nav
              className="hidden items-center gap-1 lg:flex"
              aria-label="پیمایش اصلی"
              onMouseLeave={() => setOpenPanel(null)}
            >
              {NAV.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenPanel(item.panel ?? null)}
                >
                  <Link
                    to={item.to}
                    onClick={closeAll}
                    className={`flex items-center gap-1 rounded-full px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-primary-100 hover:text-brand-indigo ${
                      location.pathname === item.to
                        ? "bg-primary-100 text-brand-indigo"
                        : "text-neutral-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <button
                type="button"
                onClick={() => setSearchOpen((value) => !value)}
                aria-label="جست‌وجو در پت‌فیت"
                className="grid h-9 w-9 place-items-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100"
              >
                <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
                  <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" strokeWidth="1.6" />
                  <path d="m13 13 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
              <Link
                to="/account"
                onClick={closeAll}
                aria-label="حساب کاربری"
                className="hidden h-9 items-center rounded-full px-3 text-[12px] font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 sm:inline-flex"
              >
                <span className="max-w-[7rem] truncate">{accountLabel}</span>
              </Link>
              <Link
                to="/cart"
                onClick={closeAll}
                aria-label={`سبد خرید، ${itemCount} قلم`}
                className="relative grid h-9 min-w-9 place-items-center rounded-full px-2 text-neutral-700 transition-colors hover:bg-neutral-100"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M6 6h15l-1.5 9h-12z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path d="M6 6 5 3H2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="9" cy="20" r="1.25" fill="currentColor" />
                  <circle cx="17" cy="20" r="1.25" fill="currentColor" />
                </svg>
                {itemCount > 0 ? (
                  <span className="absolute -top-0.5 -start-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-orange-hot px-1 text-[9px] font-bold text-white">
                    {itemCount}
                  </span>
                ) : null}
                <span className="sr-only">
                  {itemCount > 0 ? formatToman(totalToman) : "سبد خالی"}
                </span>
              </Link>
              <Link
                to="/subscriptions"
                onClick={closeAll}
                className="hidden items-center gap-1.5 rounded-full bg-brand-orange-hot px-5 py-2.5 text-p-xs font-semibold text-white sm:inline-flex"
              >
                شروع اشتراک
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen((value) => !value)}
                aria-label={mobileOpen ? "بستن فهرست" : "باز کردن فهرست"}
                className="grid h-10 w-10 place-items-center rounded-full text-neutral-700 lg:hidden"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  {mobileOpen ? (
                    <path
                      d="m4 4 12 12M16 4 4 16"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  ) : (
                    <path
                      d="M2.5 5h15M2.5 10h15M2.5 15h10"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          <div
            className={`absolute top-full left-0 w-full overflow-hidden border-b border-neutral-200 bg-white transition-[max-height,opacity] duration-300 ${
              searchOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <form className="o-container flex items-center gap-3 py-4" onSubmit={submitSearch}>
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                type="search"
                placeholder="نام محصول یا ماده‌ی اولیه را بنویسید"
                className="w-full bg-transparent text-p-sm font-medium text-neutral-700 outline-none"
              />
              <button type="submit" className="a-button px-5 py-2 text-p-xs">
                جست‌وجو
              </button>
            </form>
          </div>

          {openPanel && (
            <div
              className="absolute top-full left-0 z-40 hidden w-full border-t border-neutral-100 bg-white shadow-[0_30px_60px_-40px_rgba(31,28,20,0.3)] lg:block"
              onMouseLeave={() => setOpenPanel(null)}
            >
              <div className="o-container--xl o-container py-8">
                {openPanel === "products" ? (
                  <div className="grid gap-2 sm:grid-cols-3">
                    {PRODUCTS.map((item) => (
                      <Link
                        key={item.title}
                        to={item.href}
                        onClick={closeAll}
                        className="flex items-center gap-3 rounded-2xl p-3 hover:bg-secondary-off-white"
                      >
                        <img src={item.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
                        <span>
                          <span className="block font-semibold text-p-sm text-neutral-700">
                            {item.title}
                          </span>
                          <span className="mt-0.5 block text-[11px] text-neutral-500">{item.copy}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link to="/#how-its-made" onClick={closeAll} className="a-button">
                    رفتن به راهنما
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        <div
          className={`fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-white transition-[opacity,transform] duration-300 lg:hidden ${
            mobileOpen
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0"
          }`}
          style={{ top: menuTop }}
        >
          <nav className="flex flex-col px-5 py-4" aria-label="فهرست موبایل">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={closeAll}
                className="border-b border-neutral-100 py-4 text-base font-semibold text-neutral-700"
              >
                {item.label}
              </Link>
            ))}
            <Link to="/subscriptions" onClick={closeAll} className="a-button mt-6 text-center">
              شروع اشتراک
            </Link>
            <Link to="/account" onClick={closeAll} className="mt-3 text-center text-sm font-semibold text-brand-indigo">
              {token && customer ? accountLabel : "حساب من"}
            </Link>
          </nav>
        </div>
      </header>

      <PersonalizeOverlay open={gateOpen} onUnlock={unlockWithForm} onDismiss={dismissGate} />
    </>
  );
}
