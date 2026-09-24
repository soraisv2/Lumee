"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Backdrop } from "./Backdrop";
import { Grid } from "./Grid";
import { SceneContent } from "./SceneContent";
import { scenes } from "./scenes";

const GESTURE_GAP_MS = 200;
const MIN_INTERVAL_MS = 900;

export function Stage() {
  const pathname = usePathname();
  const router = useRouter();
  const index = Math.max(0, scenes.findIndex((scene) => scene.path === pathname));
  const scene = scenes[index];

  const indexRef = useRef(index);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    let lastWheel = 0;
    let lastMove = 0;
    let touchStartY: number | null = null;

    const step = (direction: number) => {
      const now = performance.now();
      const next = scenes[indexRef.current + direction];
      if (!next || now - lastMove < MIN_INTERVAL_MS) return;
      lastMove = now;
      router.push(next.path, { scroll: false });
    };

    // Trackpad inertia streams events without pauses, so only the first event
    // after a pause counts: one swipe or one wheel flick moves exactly one scene.
    const onWheel = (event: WheelEvent) => {
      const now = performance.now();
      const newGesture = now - lastWheel > GESTURE_GAP_MS;
      lastWheel = now;
      if (newGesture && Math.abs(event.deltaY) > 2) step(Math.sign(event.deltaY));
    };
    const onKey = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(event.key)) step(1);
      else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) step(-1);
      else return;
      event.preventDefault();
    };
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0].clientY;
    };
    const onTouchEnd = (event: TouchEvent) => {
      if (touchStartY === null) return;
      const delta = touchStartY - event.changedTouches[0].clientY;
      if (Math.abs(delta) > 50) step(Math.sign(delta));
      touchStartY = null;
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [router]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-white">
      <Backdrop active={scene.id} />
      <Grid scene={scene} />
      {scenes.map((item) => (
        <SceneContent key={item.id} id={item.id} active={item.id === scene.id} />
      ))}

      <header className="label absolute inset-x-0 top-0 z-40 flex items-start justify-between gap-6 px-5 pt-5 md:px-10 md:pt-7">
        <Link href="/" className="text-[13px] font-extrabold tracking-[0.32em]">
          Lumee
        </Link>
        <nav aria-label="Navigation principale" className="flex gap-4 md:gap-8">
          {scenes.map((item, i) => (
            <Link
              key={item.id}
              href={item.path}
              scroll={false}
              aria-current={item.id === scene.id ? "page" : undefined}
              className="transition-opacity duration-500 hover:opacity-100 aria-[current=page]:opacity-100 opacity-50"
            >
              <span className="mr-2 hidden tabular-nums md:inline">0{i + 1}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <span className="hidden md:block">©2026</span>
      </header>

      <div className="label absolute inset-x-0 bottom-0 z-40 flex items-end justify-between px-5 pb-5 md:px-10 md:pb-7">
        <span className="tabular-nums">
          0{index + 1} / 0{scenes.length}
        </span>
        <span aria-hidden className="flex gap-1.5">
          {scenes.map((item) => (
            <span
              key={item.id}
              className={`h-px w-6 transition-colors duration-700 ${item.id === scene.id ? "bg-white" : "bg-white/30"}`}
            />
          ))}
        </span>
        <span className="hidden md:block">Molette ou flèches</span>
      </div>
    </div>
  );
}
