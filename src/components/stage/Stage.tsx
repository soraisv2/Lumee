"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { AiScene } from "./AiScene";
import { Backdrop } from "./Backdrop";
import { Grid } from "./Grid";
import { aiLayout, projectsLayout } from "./layout";
import { projects } from "./projects";
import { ProjectsScene } from "./ProjectsScene";
import { SceneContent } from "./SceneContent";
import { scenes } from "./scenes";
import { useViewport } from "./useViewport";

const GESTURE_GAP_MS = 200;
const WHEEL_THRESHOLD_PX = 12;
const MIN_INTERVAL_MS = 900;

export function Stage() {
  const pathname = usePathname();
  const router = useRouter();
  // /studio/ia is the Studio scene with its AI detail open.
  const aiOpen = pathname === "/studio/ia";
  const index = Math.max(0, scenes.findIndex((scene) => scene.path === (aiOpen ? "/studio" : pathname)));
  const scene = scenes[index];
  const viewport = useViewport();

  // An enlarged project only belongs to the scene it was opened in.
  const [openProject, setOpenProject] = useState<number | null>(null);
  const [openScene, setOpenScene] = useState(scene.id);
  if (openScene !== scene.id) {
    setOpenScene(scene.id);
    setOpenProject(null);
  }

  const projectsView = projectsLayout(projects.length, viewport.width, viewport.height, openProject);
  const geometry =
    scene.id === "projets"
      ? projectsView.geometry
      : aiOpen
        ? aiLayout(viewport.height > viewport.width)
        : scene;
  const detailOpen = openProject !== null || aiOpen;

  const indexRef = useRef(index);
  const openRef = useRef(openProject);
  const aiRef = useRef(aiOpen);
  useEffect(() => {
    indexRef.current = index;
    openRef.current = openProject;
    aiRef.current = aiOpen;
  }, [index, openProject, aiOpen]);

  useEffect(() => {
    let lastWheel = 0;
    let gestureDelta = 0;
    let gestureUsed = false;
    let lastMove = 0;
    let touchStartY: number | null = null;

    // While a detail (enlarged project, AI page) is open, scene navigation pauses until it is closed.
    const detailIsOpen = () => openRef.current !== null || aiRef.current;
    const step = (direction: number) => {
      const now = performance.now();
      const next = scenes[indexRef.current + direction];
      if (detailIsOpen() || !next || now - lastMove < MIN_INTERVAL_MS) return;
      lastMove = now;
      router.push(next.path, { scroll: false });
    };

    // A gesture is a burst of wheel events with no pause longer than GESTURE_GAP_MS.
    // Trackpads start a swipe with tiny deltas, so movement is summed until it
    // crosses the threshold; the gesture then stays used until it ends, which
    // stops trackpad inertia from skipping a second scene.
    const onWheel = (event: WheelEvent) => {
      const now = performance.now();
      if (now - lastWheel > GESTURE_GAP_MS) {
        gestureDelta = 0;
        gestureUsed = false;
      }
      lastWheel = now;
      if (gestureUsed) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      gestureDelta += event.deltaY * unit;
      if (Math.abs(gestureDelta) >= WHEEL_THRESHOLD_PX) {
        gestureUsed = true;
        step(Math.sign(gestureDelta));
      }
    };
    const onKey = (event: KeyboardEvent) => {
      const onControl = event.target instanceof Element && event.target.closest("a, button");
      if (event.key === " " && onControl) return;
      if (event.key === "Escape" && openRef.current !== null) setOpenProject(null);
      else if (event.key === "Escape" && aiRef.current) router.push("/studio", { scroll: false });
      else if (detailIsOpen()) return;
      else if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(event.key)) step(1);
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
      <Grid geometry={geometry} />
      {scenes.map((item) =>
        item.id === "projets" ? (
          <ProjectsScene
            key={item.id}
            active={scene.id === "projets"}
            layout={projectsView}
            open={openProject}
            onOpen={setOpenProject}
            onClose={() => setOpenProject(null)}
          />
        ) : item.id === "studio" ? (
          <Fragment key={item.id}>
            <SceneContent id="studio" active={scene.id === "studio" && !aiOpen} />
            <AiScene active={scene.id === "studio" && aiOpen} />
          </Fragment>
        ) : (
          <SceneContent key={item.id} id={item.id} active={item.id === scene.id} />
        ),
      )}

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
        <span className="hidden md:block">{detailOpen ? "Échap pour fermer" : "Molette ou flèches"}</span>
      </div>
    </div>
  );
}
