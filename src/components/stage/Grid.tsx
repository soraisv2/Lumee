import type { Geometry } from "./scenes";

const STAGGER_MS = 45;
const DOT_REVEAL_MS = 1100;

type Vars = React.CSSProperties & Record<`--${string}`, number | string>;

// Lines keep stable keys across scenes, so changing scene moves the same
// elements and CSS transitions animate them to their new positions.
// Sits above scene content so lines frame it; it never takes pointer events.
export function Grid({ geometry }: { geometry: Geometry }) {
  const vDelay = (i: number) => i * STAGGER_MS;
  const hDelay = (i: number) => (geometry.v.length + i) * STAGGER_MS;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[35]">
      {geometry.v.map((x, i) => (
        <span
          key={`v${i}`}
          className="grid-line grid-line-v"
          style={{ "--p": x, "--o": geometry.vOff?.includes(i) ? 0 : 1, transitionDelay: `${vDelay(i)}ms` } as Vars}
        />
      ))}
      {geometry.h.map((y, i) => (
        <span
          key={`h${i}`}
          className="grid-line grid-line-h"
          style={{ "--p": y, "--o": geometry.hOff?.includes(i) ? 0 : 1, transitionDelay: `${hDelay(i)}ms` } as Vars}
        />
      ))}
      {geometry.v.flatMap((x, vi) =>
        geometry.h.map((y, hi) => {
          const on = geometry.dots.some(([a, b]) => a === vi && b === hi);
          const reveal = on ? DOT_REVEAL_MS : 0;
          return (
            <span
              key={`d${vi}-${hi}`}
              className="grid-dot"
              style={
                {
                  "--x": x,
                  "--y": y,
                  "--o": on ? 1 : 0,
                  transitionDelay: `${vDelay(vi)}ms, ${hDelay(hi)}ms, ${reveal}ms, ${reveal}ms`,
                } as Vars
              }
            />
          );
        }),
      )}
    </div>
  );
}
