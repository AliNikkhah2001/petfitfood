import CmsPageView from "../components/CmsPageView";
import { CONTACT, telHref } from "../data/contact";

function StaticContact() {
  return (
    <div className="min-h-screen bg-secondary-off-white pb-16 pt-6">
      <div className="o-container mx-auto max-w-2xl">
        <p className="eyebrow">تماس</p>
        <h1 className="mt-2 text-h-4xl text-brand-indigo">با تیم پت‌فیت در ارتباط باشید</h1>
        <p className="mt-2 text-sm leading-7 text-neutral-600">{CONTACT.tagline}</p>
        <dl className="mt-8 space-y-5 rounded-2xl border border-neutral-200 bg-white p-6">
          <div>
            <dt className="text-xs font-bold text-brand-indigo">موبایل</dt>
            <dd className="mt-1">
              <a href={telHref(CONTACT.phoneMobile)} dir="ltr" className="text-sm font-semibold text-neutral-800">
                {CONTACT.phoneMobile}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold text-brand-indigo">تلفن ثابت</dt>
            <dd className="mt-1">
              <a href={telHref(CONTACT.phoneLandline)} dir="ltr" className="text-sm font-semibold text-neutral-800">
                {CONTACT.phoneLandline}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold text-brand-indigo">اینستاگرام</dt>
            <dd className="mt-1">
              <a
                href={CONTACT.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-neutral-800"
              >
                {CONTACT.instagram}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return <CmsPageView slug="contact" fallback={<StaticContact />} />;
}
