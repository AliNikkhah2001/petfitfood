"""Canonical seed catalog aligned with apps/web/src/data/catalog.ts."""

PRODUCTS = [
    {
        "external_id": "chicken-pro",
        "slug": "morgh-pro",
        "group": "chicken",
        "name_fa": "غذای تر مرغ (Pro)",
        "description": "تهیه‌شده از مرغ تازه و مواد اولیه باکیفیت؛ مناسب پت‌های فعال و حساس.",
        "ingredients": ["فیله مرغ", "دل و جگر مرغ", "هویج", "کدو حلوایی", "کدو سبز", "سیب‌زمینی"],
        "prices": [(1000, 830_000), (400, 464_000)],
        "image": "/content/packaging/chicken-fresh.png",
        "badge": "Pro",
    },
    {
        "external_id": "chicken-pro-cat",
        "slug": "morgh-pro-gorbeh",
        "group": "chicken",
        "name_fa": "غذای تر مرغ (Pro) برای گربه",
        "description": "مرغ تازه و جگر؛ منبع غنی پروتئین و آهن برای انرژی بیشتر.",
        "ingredients": ["مرغ تازه", "جگر مرغ", "هویج", "کدو حلوایی", "کدو سبز", "سیب‌زمینی"],
        "prices": [(1000, 830_000), (400, 464_000)],
        "image": "/brand/bowls/chicken.jpg",
        "badge": "Pro · گربه",
    },
    {
        "external_id": "chicken-normal-dog",
        "slug": "morgh-normal-sag",
        "group": "chicken",
        "name_fa": "غذای تر مرغ (Normal) برای سگ",
        "description": "مرغ تازه و مواد طبیعی؛ مناسب تغذیهٔ روزانه.",
        "ingredients": ["مرغ", "دل و جگر مرغ", "هویج", "کدو حلوایی", "کدو سبز", "سیب‌زمینی"],
        "prices": [(1000, 750_000), (400, 420_000)],
        "image": "/brand/bowls/intro.jpg",
        "badge": "Normal · سگ",
    },
    {
        "external_id": "chicken-soup",
        "slug": "sup-morgh",
        "group": "chicken",
        "name_fa": "سوپ مرغ",
        "description": "سوپ سبک و مغذی برای آبرسانی، تقویت ایمنی و اشتهای بهتر.",
        "ingredients": ["مرغ", "دل و جگر مرغ", "هویج", "کدو حلوایی", "کدو سبز", "سیب‌زمینی", "عصاره مرغ"],
        "prices": [(1000, 690_000), (400, 360_000)],
        "image": "/content/packaging/chicken-soup.png",
        "badge": "سوپ",
    },
    {
        "external_id": "beef-pro",
        "slug": "gusaleh-pro",
        "group": "beef",
        "name_fa": "غذای تر گوشت گوساله (Pro)",
        "description": "مواد اولیه تازه و باکیفیت؛ مناسب پت‌های فعال و حساس.",
        "ingredients": ["گوشت گوساله", "دل و جگر مرغ", "هویج", "کدو حلوایی", "کدو سبز", "سیب‌زمینی"],
        "prices": [(1000, 1_760_000), (400, 880_000), (250, 520_000)],
        "image": "/content/packaging/beef-fresh.png",
        "badge": "Pro",
    },
    {
        "external_id": "beef-normal",
        "slug": "gusaleh-normal",
        "group": "beef",
        "name_fa": "غذای تر گوشت گوساله (Normal)",
        "description": "مواد طبیعی و متعادل؛ مناسب تغذیهٔ روزانه.",
        "ingredients": ["گوشت گوساله", "دل و جگر مرغ", "هویج", "کدو حلوایی", "کدو سبز", "سیب‌زمینی"],
        "prices": [(1000, 1_380_000), (400, 650_000), (250, 440_000)],
        "image": "/brand/bowls/beef.jpg",
        "badge": "Normal",
    },
    {
        "external_id": "beef-soup",
        "slug": "sup-gusaleh",
        "group": "beef",
        "name_fa": "سوپ گوشت گوساله",
        "description": "سوپ مغذی و خوش‌طعم برای افزایش اشتها و آبرسانی.",
        "ingredients": ["گوشت گوساله", "دل و جگر مرغ", "هویج", "کدو حلوایی", "کدو سبز", "سیب‌زمینی", "عصاره قلم"],
        "prices": [(1000, 1_120_000), (400, 580_000), (250, 410_000)],
        "image": "/brand/bowls/beef.jpg",
        "badge": "سوپ",
    },
]

MAGAZINE = [
    {
        "slug": "taze-yani-chetori",
        "title": "تازه یعنی چطوری؟ از آشپزخانه تا کاسه",
        "excerpt": "مسیر آماده‌سازی، بسته‌بندی و نگهداری غذای تر در خانه.",
        "published_at": "۱۴۰۴/۰۸/۱۲",
        "cover": "/content/gallery/reel-15.jpg",
        "body": (
            "<p>در پت‌فیت، «تازه» فقط یک برچسب نیست؛ زنجیرهٔ تولید تا تحویل طوری طراحی شده "
            "که بافت و ارزش غذایی حفظ شود.</p>"
            "<p>مواد اولیه پس از کنترل کیفیت آماده می‌شوند، پخت کنترل‌شده انجام می‌گیرد و "
            "بلافاصله در بستهٔ مخصوص بسته‌بندی می‌شود.</p>"
        ),
    },
    {
        "slug": "entekhab-protein",
        "title": "مرغ یا گوساله؟ راهنمای انتخاب پروتئین",
        "excerpt": "تفاوت وعده‌های مرغ و گوساله برای سگ و گربه فعال.",
        "published_at": "۱۴۰۴/۰۷/۲۸",
        "cover": "/brand/bowls/chicken.jpg",
        "body": (
            "<p>مرغ معمولاً هضم آسان‌تری دارد و برای شروع یا پت‌های حساس گزینهٔ محبوبی است.</p>"
            "<p>گوساله انرژی و پروتئین بالاتری دارد و برای پت‌های بزرگ‌تر یا بسیار فعال مناسب است.</p>"
        ),
    },
    {
        "slug": "sagh-gorbeh-mizan",
        "title": "مقدار وعده: سگ، گربه و وزن بدن",
        "excerpt": "نکته‌های ساده برای تنظیم حجم روزانه بدون حدس زدن.",
        "published_at": "۱۴۰۴/۰۷/۰۵",
        "cover": "/brand/petfit-catdog-friends.jpg",
        "body": (
            "<p>وزن بدن، سن و میزان فعالیت سه متغیر اصلی هستند. روی هر بسته راهنمای تقریبی وزن وجود دارد.</p>"
            "<p>بهتر است تغییرات را آهسته انجام دهید و واکنش پوست، مدفوع و اشتها را چند روز زیر نظر بگیرید.</p>"
        ),
    },
]

CONTENT_PAGES = [
    {
        "slug": "about",
        "title": "داستان ما",
        "page_kind": "about",
        "body": "<p>پت‌فیت غذای گرم و تازه را برای کوچولوی شما آماده می‌کند.</p>",
    },
    {
        "slug": "faq",
        "title": "پرسش‌های متداول",
        "page_kind": "faq",
        "body": "<p>پرسش‌های رایج دربارهٔ نگهداری، ارسال و اشتراک.</p>",
    },
    {
        "slug": "privacy",
        "title": "حریم خصوصی",
        "page_kind": "privacy",
        "body": "<p>اطلاعات تماس و سفارش فقط برای پردازش سفارش استفاده می‌شود.</p>",
    },
    {
        "slug": "terms",
        "title": "شرایط استفاده",
        "page_kind": "terms",
        "body": "<p>با ثبت سفارش، شرایط هماهنگی ارسال و پرداخت را می‌پذیرید.</p>",
    },
]
