import { INSTAGRAM_REELS, PACKSHOT } from "../data/catalog";
import { CONTACT } from "../data/contact";

/** Instagram reel posts from contents dump — playable gallery. */
export default function InstagramGallery() {
  return (
    <section id="instagram-gallery" className="bg-secondary-off-white py-16 md:py-20">
      <div className="o-container--xl o-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">گالری اینستاگرام</p>
          <h2 className="mt-3 text-h-4xl text-neutral-800 md:text-h-5xl">
            ریلز و ویدیوهای {CONTACT.instagram}
          </h2>
          <p className="mt-3 text-sm leading-7 text-neutral-600 md:text-base">
            پشت‌صحنهٔ آماده‌سازی، بسته‌بندی و نکته‌های تغذیه — همان پست‌های ویدیویی
            منتشرشده در اینستاگرام پت‌فیت.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-neutral-200">
          <img
            src={PACKSHOT}
            alt="محصولات واقعی پت‌فیت در یک قاب"
            className="max-h-[420px] w-full object-cover object-center"
            loading="lazy"
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {INSTAGRAM_REELS.map((reel) => (
            <article
              key={reel.id}
              className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[9/16] bg-neutral-900">
                <video
                  className="h-full w-full object-cover"
                  poster={reel.poster}
                  controls
                  playsInline
                  preload="none"
                  aria-label={reel.title}
                >
                  <source src={reel.src} type="video/mp4" />
                </video>
              </div>
              <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                <p className="truncate text-xs font-bold text-neutral-800">{reel.title}</p>
                <a
                  href={CONTACT.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 text-[10px] font-bold text-brand-orange-hot"
                >
                  اینستاگرام
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
