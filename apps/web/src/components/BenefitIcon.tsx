/**
 * Benefit icons are inline SVG rather than raster images, so they stay
 * razor sharp at any density and never trigger a network request.
 */

export type BenefitIconName =
  | "bowl"
  | "coat"
  | "weight"
  | "energy"
  | "digestion";

const paths: Record<BenefitIconName, React.ReactNode> = {
  bowl: (
    <>
      <path d="M4 11h16c0 4.4-3.1 7.4-8 7.4S4 15.4 4 11Z" />
      <path d="M7.4 8.2c0-1.3 1.2-2.2 2.7-2.2s2.7.9 2.7 2.2" />
      <path d="M13.4 8.6c0-1 1-1.7 2.2-1.7s2.2.7 2.2 1.7" />
    </>
  ),
  coat: (
    <>
      <path d="M12 20.5c-4 0-6.6-2.4-6.6-5.9 0-2.7 1.7-4.4 3.3-6 1-1 2-2 2.4-3.3.2-.6 1-.7 1.3-.1.7 1.2.6 2.6.2 3.9-.2.7.3 1.3 1 1.2 1.6-.2 2.9-1.6 3.4-3.2.2-.6 1-.7 1.3-.1.9 1.7 1.3 3.6 1.3 5.6 0 4.9-3.6 7.9-7.6 7.9Z" />
      <path d="M9.6 15.4c.6 1.5 1.9 2.4 3.6 2.4" />
    </>
  ),
  weight: (
    <>
      <path d="M5.5 8.5h13c.8 0 1.5.7 1.5 1.5v7c0 .8-.7 1.5-1.5 1.5h-13c-.8 0-1.5-.7-1.5-1.5v-7c0-.8.7-1.5 1.5-1.5Z" />
      <path d="M9.4 8.5 12 4.5l2.6 4" />
      <circle cx="9.6" cy="14" r="1.5" />
      <circle cx="14.4" cy="14" r="1.5" />
    </>
  ),
  energy: (
    <>
      <path d="M13.8 3.5 6.6 12h4.2l-.6 8.5L17.4 12h-4.2l.6-8.5Z" />
    </>
  ),
  digestion: (
    <>
      <path d="M6.5 9.5h11c1.1 0 2 .9 2 2s-.9 2-2 2h-.6c.4.6.6 1.3.6 2 0 2.2-1.8 3.9-4 3.9H10c-3.3 0-6-2.7-6-6s2.7-6 6-6" />
      <path d="M10 7.5V5.4" />
      <path d="M13.2 7.5V5.9" />
      <path d="M16.4 7.5V6.3" />
    </>
  ),
};

export default function BenefitIcon({
  name,
  className = "h-14 w-14 md:h-16 md:w-16",
}: {
  name: BenefitIconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
