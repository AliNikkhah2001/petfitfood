type LogoProps = {
  className?: string;
  /** Kept for API compat; PNG lockup ignores fill color. */
  color?: string;
  /** Full lockup vs compact wordmark (after deep scroll). */
  variant?: "lockup" | "wordmark";
};

/** Official PetFit mark — lockup PNG or compact text. */
export default function Logo({
  className = "",
  color = "#30246C",
  variant = "lockup",
}: LogoProps) {
  if (variant === "wordmark") {
    return (
      <span
        className={`font-petfit font-extrabold tracking-tight ${className}`}
        style={{ color }}
        role="img"
        aria-label="PetFit"
        dir="ltr"
      >
        PetFit
      </span>
    );
  }

  const size = /\bh-/.test(className) ? "" : "h-10 w-auto md:h-12";
  return (
    <img
      src="/brand/petfit-logo-catdog.png"
      alt="PetFit"
      className={`${size} w-auto ${className}`.trim()}
      width={200}
      height={81}
      decoding="async"
    />
  );
}
