import { useEffect, useId, useState, type FormEvent } from "react";
import CatDogDuo from "./CatDogDuo";

export const PERSONALIZE_STORAGE_KEY = "petfit-personalize";

type PetFields = {
  name: string;
  weight: string;
  breed: string;
};

type Props = {
  open: boolean;
  onUnlock: (payload: {
    phone: string;
    dog: PetFields;
    cat: PetFields;
  }) => void;
  onDismiss: () => void;
};

const emptyPet = (): PetFields => ({ name: "", weight: "", breed: "" });

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  dir,
  inputMode,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  dir?: "ltr" | "rtl";
  inputMode?: "numeric" | "text" | "tel";
}) {
  return (
    <label className="flex flex-col gap-1.5" htmlFor={id}>
      <span className="text-[11px] font-bold text-brand-indigo/90">{label}</span>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        dir={dir}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-2xl border border-white/50 bg-white/75 px-3.5 text-sm font-semibold text-brand-indigo shadow-sm outline-none backdrop-blur-sm transition focus:border-brand-orange-hot focus:bg-white"
      />
    </label>
  );
}

function PetColumn({
  title,
  accent,
  pet,
  setPet,
  idPrefix,
}: {
  title: string;
  accent: string;
  pet: PetFields;
  setPet: (next: PetFields) => void;
  idPrefix: string;
}) {
  return (
    <div
      className={`flex min-w-0 flex-1 flex-col gap-3 rounded-[1.75rem] border border-white/40 bg-white/35 p-4 shadow-[0_20px_50px_-30px_rgba(48,36,108,0.45)] backdrop-blur-md md:p-5 ${accent}`}
    >
      <p className="text-center text-sm font-extrabold tracking-tight text-brand-indigo md:text-base">
        {title}
      </p>
      <Field
        id={`${idPrefix}-name`}
        label="نام"
        value={pet.name}
        onChange={(name) => setPet({ ...pet, name: name.slice(0, 40) })}
        placeholder="مثلاً پوفی"
      />
      <Field
        id={`${idPrefix}-weight`}
        label="وزن (کیلوگرم)"
        value={pet.weight}
        onChange={(weight) => setPet({ ...pet, weight: weight.replace(/[^\d.]/g, "").slice(0, 6) })}
        placeholder="مثلاً ۴.۵"
        inputMode="numeric"
        dir="ltr"
      />
      <Field
        id={`${idPrefix}-breed`}
        label="نژاد"
        value={pet.breed}
        onChange={(breed) => setPet({ ...pet, breed: breed.slice(0, 40) })}
        placeholder="مثلاً شیتزو"
      />
    </div>
  );
}

export default function PersonalizeOverlay({ open, onUnlock, onDismiss }: Props) {
  const titleId = useId();
  const [phone, setPhone] = useState("");
  const [dog, setDog] = useState<PetFields>(emptyPet);
  const [cat, setCat] = useState<PetFields>(emptyPet);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onDismiss]);

  if (!open) return null;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      setError("شماره موبایل را کامل وارد کنید (حداقل ۱۰ رقم).");
      return;
    }
    const dogOk = dog.name.trim().length >= 2;
    const catOk = cat.name.trim().length >= 2;
    if (!dogOk && !catOk) {
      setError("حداقل نام یکی از پت‌ها (سگ یا گربه) را وارد کنید.");
      return;
    }
    setError("");
    onUnlock({ phone: digits, dog, cat });
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-stretch justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="absolute inset-0 bg-brand-indigo/25 backdrop-blur-xl"
        aria-hidden="true"
        onClick={onDismiss}
      />

      <div className="relative z-10 flex h-full w-full max-w-5xl flex-col overflow-y-auto px-4 py-5 sm:px-6 md:py-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-full border border-white/50 bg-white/55 px-4 py-2 text-xs font-bold text-brand-indigo backdrop-blur-md transition hover:bg-white"
          >
            بعداً
          </button>
          <button
            type="button"
            aria-label="بستن"
            onClick={onDismiss}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/50 bg-white/55 text-brand-indigo backdrop-blur-md transition hover:bg-white"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="m3 3 10 10M13 3 3 13"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <form
          onSubmit={submit}
          className="mx-auto flex w-full flex-1 flex-col justify-center gap-5 pb-6"
        >
          <div className="text-center">
            <CatDogDuo className="mb-3" />
            <h2 id={titleId} className="text-xl font-extrabold text-brand-indigo md:text-2xl">
              غذای شخصی‌سازی‌شده پت‌فیت
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-brand-indigo/80">
              مثل لوگوی پت‌فیت، سگ و گربه کنار هم‌اند — مشخصات هر کدام را پر کنید تا بستهٔ مناسب بسازیم.
            </p>
          </div>

          <div className="mx-auto w-full max-w-sm">
            <Field
              id="owner-phone"
              label="شماره موبایل"
              value={phone}
              onChange={(v) => setPhone(v.replace(/\D/g, "").slice(0, 11))}
              placeholder="09xxxxxxxxx"
              type="tel"
              inputMode="tel"
              dir="ltr"
            />
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-5">
            {/* RTL: dog on the right (first in DOM), cat on the left */}
            <PetColumn
              title="سگ"
              accent="ring-1 ring-brand-orange-hot/30"
              pet={dog}
              setPet={setDog}
              idPrefix="dog"
            />
            <PetColumn
              title="گربه"
              accent="ring-1 ring-brand-indigo/25"
              pet={cat}
              setPet={setCat}
              idPrefix="cat"
            />
          </div>

          {error ? (
            <p className="text-center text-sm font-semibold text-red-600">{error}</p>
          ) : (
            <p className="text-center text-xs text-brand-indigo/65">
              پر کردن یکی از دو ستون کافی است؛ می‌توانید بعداً هم برگردید.
            </p>
          )}

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              type="submit"
              className="inline-flex min-h-12 w-full max-w-sm items-center justify-center rounded-2xl bg-brand-orange-hot px-8 text-sm font-extrabold text-white shadow-[0_16px_40px_-18px_rgba(232,93,4,0.85)] transition hover:bg-primary-600 sm:w-auto"
            >
              اشتراک غذای شخصی‌سازی‌شده
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="text-sm font-bold text-brand-indigo/70 underline decoration-brand-indigo/30 underline-offset-4 hover:text-brand-indigo"
            >
              بعداً می‌آیم
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
