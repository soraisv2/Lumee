type Vars = React.CSSProperties & Record<`--${string}`, number>;

// Each line slides out of its own mask; the parent scene's data-active drives the timing.
export function Reveal({ lines, start = 0 }: { lines: React.ReactNode[]; start?: number }) {
  return lines.map((line, i) => (
    <span key={i} className="reveal-line">
      <span style={{ "--i": start + i } as Vars}>{line}</span>
    </span>
  ));
}
