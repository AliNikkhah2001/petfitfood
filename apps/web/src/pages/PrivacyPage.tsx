import CmsPageView from "../components/CmsPageView";

function StaticPrivacy() {
  return (
    <div className="min-h-screen bg-secondary-off-white pb-16 pt-6">
      <div className="o-container mx-auto max-w-2xl">
        <h1 className="text-h-4xl text-brand-indigo">حریم خصوصی</h1>
        <p className="mt-4 text-sm leading-8 text-neutral-700">
          اطلاعاتی که هنگام ثبت سفارش یا تماس در اختیار ما می‌گذارید فقط برای پردازش سفارش، هماهنگی ارسال و پشتیبانی
          استفاده می‌شود. ما داده‌های شما را به اشخاص ثالث غیرمرتبط با ارائهٔ خدمات نمی‌فروشیم.
        </p>
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return <CmsPageView slug="privacy" fallback={<StaticPrivacy />} />;
}
