export function Arrow({ className, direction = "right" }: { className?: string; direction?: "right" | "up-right" | "left" }) {
  const rotation = { right: 0, "up-right": -45, left: 180 }[direction];
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      style={{ width: "1em", height: "1em", transform: `rotate(${rotation}deg)` }}
    >
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
