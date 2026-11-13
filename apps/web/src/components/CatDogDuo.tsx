/** Animated cat↔dog lockup inspired by the PetFit logo. */
export default function CatDogDuo({ className = "" }: { className?: string }) {
  return (
    <div className={`catdog-duo relative mx-auto ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 320 180"
        className="h-auto w-full max-w-[340px] drop-shadow-[0_18px_40px_rgba(48,36,108,0.28)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="catdog-body" x1="40" y1="40" x2="280" y2="150" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F5A623" />
            <stop offset="0.55" stopColor="#FF8A3D" />
            <stop offset="1" stopColor="#E85D04" />
          </linearGradient>
        </defs>

        {/* Shared body — glued together like the logo */}
        <g className="catdog-body">
          <ellipse cx="160" cy="118" rx="108" ry="42" fill="url(#catdog-body)" />
          <ellipse cx="118" cy="112" rx="22" ry="14" fill="#FFF6E8" opacity="0.85" />
          <ellipse cx="198" cy="122" rx="18" ry="11" fill="#FFF6E8" opacity="0.7" />
        </g>

        {/* Cat (start / right in RTL visual: drawn on left of SVG) */}
        <g className="catdog-cat origin-center">
          <path
            d="M78 78c-18-2-34 12-34 32 0 22 18 36 40 34 20-2 34-18 32-38-2-16-18-26-38-28Z"
            fill="url(#catdog-body)"
          />
          <path d="M52 58l10 28-22 6 12-34Z" fill="url(#catdog-body)" />
          <path d="M98 56l-6 30 24 2-18-32Z" fill="url(#catdog-body)" />
          <ellipse cx="74" cy="96" rx="8" ry="10" fill="#FFF6E8" />
          <circle cx="64" cy="88" r="4.5" fill="#30246C" />
          <circle cx="86" cy="88" r="4.5" fill="#30246C" />
          <circle cx="65.5" cy="86.5" r="1.4" fill="#fff" />
          <circle cx="87.5" cy="86.5" r="1.4" fill="#fff" />
          <path d="M74 96c2 3 6 3 8 0" stroke="#30246C" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M48 98h-14M48 104h-12M100 98h14M100 104h12"
            stroke="#30246C"
            strokeWidth="1.6"
            strokeLinecap="round"
            className="catdog-whisker"
          />
        </g>

        {/* Dog */}
        <g className="catdog-dog">
          <path
            d="M242 76c18-4 40 8 42 30 2 24-16 42-40 44-22 2-40-14-40-36 0-18 16-34 38-38Z"
            fill="url(#catdog-body)"
          />
          <ellipse cx="212" cy="86" rx="14" ry="18" fill="url(#catdog-body)" className="catdog-ear" />
          <ellipse cx="268" cy="84" rx="12" ry="16" fill="url(#catdog-body)" className="catdog-ear-r" />
          <ellipse cx="246" cy="108" rx="16" ry="12" fill="#FFF6E8" />
          <circle cx="232" cy="92" r="4.8" fill="#30246C" />
          <circle cx="254" cy="92" r="4.8" fill="#30246C" />
          <circle cx="233.6" cy="90.4" r="1.5" fill="#fff" />
          <circle cx="255.6" cy="90.4" r="1.5" fill="#fff" />
          <ellipse cx="246" cy="112" rx="7" ry="5" fill="#30246C" />
          <path d="M238 118c6 6 16 6 22 0" stroke="#30246C" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Soft heart between them */}
        <path
          className="catdog-heart"
          d="M160 86c-4-8-14-8-14 0 0 10 14 18 14 18s14-8 14-18c0-8-10-8-14 0Z"
          fill="#FF5A5F"
        />
      </svg>
    </div>
  );
}
