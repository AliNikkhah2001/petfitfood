import { asset } from "../lib/asset";

/**
 * Ultra-wide fused CatDog mascot (transparent PNG) for the personalize overlay.
 */
export default function CatDogDuo({ className = "" }: { className?: string }) {
  return (
    <div
      className={`catdog-duo relative mx-auto w-full overflow-visible ${className}`}
      aria-hidden="true"
    >
      <img
        src={`${asset("brand/petfit-catdog-wide.png")}?v=ultrawide`}
        alt=""
        className="catdog-mascot-img block w-full max-w-none"
        draggable={false}
      />
    </div>
  );
}
