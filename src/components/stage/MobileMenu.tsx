import Link from "next/link";
import { useEffect, useRef } from "react";
import { MENU_BAND_HEIGHT, MENU_BANDS } from "./layout";
import { scenes, type SceneId } from "./scenes";

const EMAIL = "contact@lumee.fr";
// A finger that travels further than this is sliding between pages, not tapping one.
const SLIDE_PX = 10;

type Vars = React.CSSProperties & Record<`--${string}`, number | string>;

const linkAt = (x: number, y: number) =>
  document.elementFromPoint(x, y)?.closest<HTMLAnchorElement>("#menu-mobile a[data-index]") ?? null;

// Full-screen menu for small screens. Its bands match menuLayout(): the grid lines
// target the page under the pointer, keyboard focus or finger (the current page by
// default), and a finger can slide down the list before letting go on a page.
export function MobileMenu({
  open,
  activeId,
  target,
  onTarget,
  onClose,
}: {
  open: boolean;
  activeId: SceneId;
  target: number;
  onTarget: (index: number) => void;
  onClose: () => void;
}) {
  const currentLink = useRef<HTMLAnchorElement>(null);
  const press = useRef<{ x: number; y: number } | null>(null);
  const activeIndex = scenes.findIndex((scene) => scene.id === activeId);

  useEffect(() => {
    if (open) currentLink.current?.focus({ preventScroll: true });
  }, [open]);

  // Touch pointers stay captured by the element they pressed, so the page under
  // the finger is looked up by position.
  const onPointerMove = (event: React.PointerEvent) => {
    if (event.pointerType !== "touch") return;
    const link = linkAt(event.clientX, event.clientY);
    if (link) onTarget(Number(link.dataset.index));
  };
  // A slide produces no click, so letting go on a page follows its link by hand.
  const onPointerUp = (event: React.PointerEvent) => {
    const start = press.current;
    press.current = null;
    if (event.pointerType !== "touch" || !start) return;
    if (Math.hypot(event.clientX - start.x, event.clientY - start.y) < SLIDE_PX) return;
    linkAt(event.clientX, event.clientY)?.click();
  };

  return (
    <div id="menu-mobile" data-active={open} inert={!open} className="menu scene absolute inset-0 z-[32] lg:hidden">
      <div aria-hidden className="menu-veil" />
      <nav
        aria-label="Menu"
        className="touch-none"
        onPointerDown={(event) => (press.current = { x: event.clientX, y: event.clientY })}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={(event) => event.pointerType === "mouse" && onTarget(activeIndex)}
      >
        {scenes.map((scene, i) => {
          const current = i === activeIndex;
          return (
            <Link
              key={scene.id}
              ref={current ? currentLink : undefined}
              href={scene.path}
              scroll={false}
              onClick={onClose}
              onPointerEnter={() => onTarget(i)}
              onFocus={(event) => event.currentTarget.matches(":focus-visible") && onTarget(i)}
              data-index={i}
              aria-current={current ? "page" : undefined}
              className="absolute inset-x-0 flex items-center"
              style={{ top: `${MENU_BANDS[i]}%`, height: `${MENU_BAND_HEIGHT}%` }}
            >
              <span
                className={`fade absolute left-[calc(6%+1.2vw)] text-xs font-medium tabular-nums ${current ? "text-(--accent)" : "text-white/60"}`}
                style={{ "--i": i } as Vars}
              >
                0{i + 1}
              </span>
              <span className="reveal-line absolute left-[calc(22%+1.2vw)] text-[clamp(1.4rem,min(9vw,8.5vh),3.2rem)] leading-none font-extrabold tracking-[-0.03em] uppercase">
                <span style={{ "--i": i } as Vars}>
                  <span className={`block transition-colors duration-500 ${i === target ? "text-white" : "text-white/35"}`}>
                    {scene.label}
                  </span>
                </span>
              </span>
            </Link>
          );
        })}
      </nav>
      <div
        className="fade label absolute top-[calc(86%+2vh)] right-[6%] left-[calc(6%+1.2vw)] flex justify-between gap-4"
        style={{ "--i": scenes.length } as Vars}
      >
        <a href={`mailto:${EMAIL}`} className="normal-case tracking-normal text-sm font-medium">
          {EMAIL}
        </a>
        <span>©2026</span>
      </div>
    </div>
  );
}
