/**
 * Faint architectural elevation line-art — building silhouettes, rooflines
 * and mullion rhythms drawn in a single stroke colour. Used at very low
 * opacity as a background layer so sections feel designed, never decorated.
 * Respects reduced motion (drift disabled via the global media query).
 */
export default function ElevationLines({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 500"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      className={className}
      style={{ animation: "ksb-drift 16s ease-in-out infinite alternate" }}
    >
      {/* ground + datum lines */}
      <line x1="0" y1="460" x2="800" y2="460" />
      <line x1="0" y1="472" x2="800" y2="472" opacity="0.5" />
      {/* tower one */}
      <rect x="90" y="180" width="170" height="280" />
      <line x1="90" y1="230" x2="260" y2="230" />
      <line x1="90" y1="280" x2="260" y2="280" />
      <line x1="90" y1="330" x2="260" y2="330" />
      <line x1="90" y1="380" x2="260" y2="380" />
      <line x1="133" y1="180" x2="133" y2="460" />
      <line x1="175" y1="180" x2="175" y2="460" />
      <line x1="217" y1="180" x2="217" y2="460" />
      {/* setback crown */}
      <rect x="120" y="140" width="110" height="40" />
      <line x1="175" y1="140" x2="175" y2="108" />
      {/* pitched block */}
      <path d="M330 460 V250 L430 170 L530 250 V460" />
      <line x1="330" y1="310" x2="530" y2="310" />
      <line x1="330" y1="370" x2="530" y2="370" />
      <line x1="380" y1="212" x2="380" y2="460" />
      <line x1="430" y1="170" x2="430" y2="460" />
      <line x1="480" y1="212" x2="480" y2="460" />
      {/* slab tower */}
      <rect x="590" y="120" width="130" height="340" />
      <line x1="590" y1="170" x2="720" y2="170" />
      <line x1="590" y1="220" x2="720" y2="220" />
      <line x1="590" y1="270" x2="720" y2="270" />
      <line x1="590" y1="320" x2="720" y2="320" />
      <line x1="590" y1="370" x2="720" y2="370" />
      <line x1="590" y1="420" x2="720" y2="420" />
      <line x1="655" y1="120" x2="655" y2="460" />
      {/* crane hint */}
      <line x1="655" y1="120" x2="655" y2="60" />
      <line x1="560" y1="60" x2="750" y2="60" />
      <line x1="700" y1="60" x2="700" y2="110" />
      <rect x="692" y="110" width="16" height="12" />
      {/* dimension ticks */}
      <line x1="40" y1="180" x2="52" y2="180" />
      <line x1="40" y1="460" x2="52" y2="460" />
      <line x1="46" y1="180" x2="46" y2="460" strokeDasharray="3 5" />
    </svg>
  );
}
