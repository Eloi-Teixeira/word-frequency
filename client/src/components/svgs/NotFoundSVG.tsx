export default function NotFoundSVG() {
  return (
    <svg
      width="380"
      height="260"
      viewBox="0 0 380 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Ilustração de nota perdida"
    >
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ffefc2" />
          <stop offset="1" stop-color="#fff4d9" />
        </linearGradient>
        <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0.06" />
          <stop offset="1" stop-color="#000000" stop-opacity="0.02" />
        </linearGradient>
      </defs>

      <rect
        x="28"
        y="20"
        width="260"
        height="200"
        rx="12"
        fill="url(#g1)"
        stroke="rgba(0,0,0,0.06)"
      />
      <path
        d="M64 38h196"
        stroke="rgba(0,0,0,0.06)"
        stroke-width="2"
        stroke-linecap="round"
      />
      <g transform="translate(40,68)">
        <rect width="180" height="120" rx="8" fill="white" opacity="0.92" />
        <rect
          x="12"
          y="14"
          width="156"
          height="12"
          rx="6"
          fill="rgba(0,0,0,0.06)"
        />
        <rect
          x="12"
          y="36"
          width="130"
          height="10"
          rx="6"
          fill="rgba(0,0,0,0.04)"
        />
        <rect
          x="12"
          y="56"
          width="100"
          height="10"
          rx="6"
          fill="rgba(0,0,0,0.04)"
        />
      </g>

      <path
        d="M274 6c6 0 10 4 10 10v10l-28-8 18-12z"
        fill="var(--accent)"
        fill-opacity="1"
        transform="translate(0,0)"
      />

      <ellipse cx="190" cy="232" rx="120" ry="18" fill="rgba(2,6,23,0.6)" />

      <circle cx="300" cy="40" r="24" fill="var(--accent)" opacity="0.12" />
    </svg>
  );
}
