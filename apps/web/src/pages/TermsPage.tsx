import CmsPageView from "../components/CmsPageView";

function StaticTerms() {
  return (
    <div className="min-h-screen bg-secondary-off-white pb-16 pt-6">
      <div className="o-container mx-auto max-w-2xl">
        <h1 className="text-h-4xl text-brand-indigo">شرایط استفاده</h1>
        <p className="mt-4 text-sm leading-8 text-neutral-700">
          با استفاده از وب‌سایت پت‌فیت، شرایط زیر را می‌پذیرید: قیمت‌ها و موجودی ممکن است بدون اطلاع قبلی به‌روز شوند؛
          ثبت سفارش به معنی قرارداد نهایی پس از تأیید تیم فروش است.
        </p>
      </div>
    </div>
  );
}

export default function TermsPage() {
  return <CmsPageView slug="terms" fallback={<StaticTerms />} />;
}
