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

const DOG_BREEDS = [
  "شیتزو",
  "پامرانین",
  "پودل",
  "مالتیس",
  "یورکشایر",
  "چیهواهوا",
  "بولداگ فرانسوی",
  "گلدن رتریور",
  "لابرادور",
  "ژرمن شپرد",
  "هاسکی",
  "بیگل",
  "تریر",
  "اسپیتز",
  "میکس / ترکیبی",
  "سایر",
] as const;

const CAT_BREEDS = [
  "پرشین",
  "سیامی",
  "بریتیش شورت‌هیر",
  "اسکاتیش فولد",
  "مین‌کون",
  "بنگال",
  "راگدول",
  "اسفینکس",
  "خانگی موکوتاه",
  "خانگی موبلند",
  "میکس / ترکیبی",
  "سایر",
] as const;

const emptyPet = (): PetFields => ({ name: "", weight: "", breed: "" });

const controlClass =
  "h-9 w-full shrink-0 rounded-xl border-2 border-brand-indigo/20 bg-white px-2.5 text-sm font-semibold text-brand-indigo outline-none transition focus:border-brand-orange-hot sm:h-10 sm:rounded-2xl sm:px-3 sm:text-base lg:h-11";

function TextField({
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
  inputMode?: "numeric" | "text" | "tel" | "decimal";
}) {
  return (
    <label className="flex min-h-0 flex-1 flex-col justify-center gap-0.5" htmlFor={id}>
      <span className="text-[11px] font-extrabold leading-none text-brand-indigo sm:text-xs">
        {label}
      </span>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        dir={dir}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${controlClass} placeholder:text-brand-indigo/35`}
      />
    </label>
  );
}

function NumberField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <label className="flex min-h-0 flex-1 flex-col justify-center gap-0.5" htmlFor={id}>
      <span className="text-[11px] font-extrabold leading-none text-brand-indigo sm:text-xs">
        {label}
      </span>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        dir="ltr"
        min={min}
        max={max}
        step={step}
        placeholder={`${min}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${controlClass} placeholder:text-brand-indigo/35`}
      />
    </label>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder: string;
}) {
  return (
    <label className="flex min-h-0 flex-1 flex-col justify-center gap-0.5" htmlFor={id}>
      <span className="text-[11px] font-extrabold leading-none text-brand-indigo sm:text-xs">
        {label}
      </span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${controlClass} appearance-none bg-[length:12px] bg-[left_0.75rem_center] bg-no-repeat pe-3 ps-8 ${
          value ? "" : "text-brand-indigo/45"
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' stroke='%2330246C' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function PetColumn({
  pet,
  setPet,
  idPrefix,
  side,
}: {
  pet: PetFields;
  setPet: (next: PetFields) => void;
  idPrefix: string;
  side: "dog" | "cat";
}) {
  const breeds = side === "dog" ? DOG_BREEDS : CAT_BREEDS;
  const weightMax = side === "dog" ? 90 : 15;

  return (
    <div
      className={`flex min-h-0 min-w-0 flex-1 flex-col gap-1.5 rounded-2xl border-2 bg-white p-2.5 sm:gap-2 sm:p-3 lg:p-4 ${
        side === "dog" ? "border-brand-orange-hot/40" : "border-brand-indigo/25"
      }`}
    >
      <span className="sr-only">{side === "dog" ? "فرم سگ" : "فرم گربه"}</span>
      <TextField
        id={`${idPrefix}-name`}
        label="نام"
        value={pet.name}
        onChange={(name) => setPet({ ...pet, name: name.slice(0, 40) })}
        placeholder="مثلاً پوفی"
      />
      <NumberField
        id={`${idPrefix}-weight`}
        label="وزن (کیلوگرم)"
        value={pet.weight}
        onChange={(weight) => setPet({ ...pet, weight })}
        min={0.5}
        max={weightMax}
        step={0.1}
      />
      <SelectField
        id={`${idPrefix}-breed`}
        label="نژاد"
        value={pet.breed}
        onChange={(breed) => setPet({ ...pet, breed })}
        options={breeds}
        placeholder="انتخاب نژاد"
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
      className="personalize-gate fixed inset-0 z-[80] flex h-[100dvh] max-h-[100dvh] w-screen flex-col overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="absolute inset-0 bg-brand-indigo/50 backdrop-blur-2xl"
        aria-hidden="true"
        onClick={onDismiss}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-secondary-off-white/30"
        aria-hidden="true"
      />

      <form
        onSubmit={submit}
        className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-[100vw] flex-col gap-2 p-2 sm:gap-2.5 sm:p-3 md:p-4 lg:px-6"
      >
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-full border-2 border-white/90 bg-white px-3.5 py-2 text-sm font-extrabold text-brand-indigo shadow-sm sm:px-4 sm:text-base"
          >
            بعداً
          </button>
          <h2
            id={titleId}
            className="min-w-0 flex-1 truncate text-center text-base font-extrabold text-brand-indigo sm:text-xl md:text-2xl"
          >
            غذای شخصی‌سازی‌شده پت‌فیت
          </h2>
          <button
            type="button"
            aria-label="بستن"
            onClick={onDismiss}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-white/90 bg-white text-brand-indigo shadow-sm sm:h-11 sm:w-11"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="m2 2 12 12M14 2 2 14"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border border-white bg-white/95 p-2.5 shadow-[0_20px_60px_-18px_rgba(48,36,108,0.5)] sm:rounded-3xl sm:p-3.5 md:p-4">
          <div className="mx-auto w-full max-w-2xl shrink-0 sm:max-w-3xl">
            <TextField
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

          <div className="personalize-catdog -mx-2.5 mt-1 w-[calc(100%+1.25rem)] shrink-0 overflow-visible sm:-mx-3.5 sm:mt-2 sm:w-[calc(100%+1.75rem)] md:-mx-4 md:w-[calc(100%+2rem)] lg:-mx-6 lg:w-[calc(100%+3rem)]">
            <CatDogDuo className="w-full max-w-none" />
          </div>

          <div className="mt-1 grid min-h-0 w-full flex-1 grid-cols-2 gap-2 sm:mt-2 sm:gap-3 md:gap-5 lg:gap-8">
            <PetColumn pet={dog} setPet={setDog} idPrefix="dog" side="dog" />
            <PetColumn pet={cat} setPet={setCat} idPrefix="cat" side="cat" />
          </div>

          {error ? (
            <p className="mt-1.5 shrink-0 rounded-xl bg-red-50 px-2 py-1 text-center text-xs font-bold text-red-700 sm:text-sm">
              {error}
            </p>
          ) : null}

          <div className="mt-2 flex shrink-0 flex-row items-center justify-center gap-2 sm:mt-3 sm:gap-3">
            <button
              type="submit"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl bg-brand-orange-hot px-4 text-sm font-extrabold text-white shadow-[0_12px_28px_-10px_rgba(232,93,4,0.9)] transition hover:bg-primary-600 sm:h-12 sm:max-w-lg sm:flex-none sm:px-10 sm:text-base md:h-13 md:text-lg"
            >
              اشتراک غذای شخصی‌سازی‌شده
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="h-11 shrink-0 rounded-2xl bg-white px-3 text-sm font-extrabold text-brand-indigo underline decoration-brand-indigo/35 underline-offset-4 hover:bg-secondary-off-white sm:h-12 sm:px-4 sm:text-base"
            >
              بعداً می‌آیم
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
