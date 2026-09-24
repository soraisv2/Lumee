import { useEffect, useRef } from "react";
import type { ProjectsLayout, Rect } from "./layout";
import { projects, type Project } from "./projects";
import { SceneShell } from "./SceneContent";

type Vars = React.CSSProperties & Record<`--${string}`, number | string>;

export function ProjectsScene({
  active,
  layout,
  open,
  onOpen,
  onClose,
}: {
  active: boolean;
  layout: ProjectsLayout;
  open: number | null;
  onOpen: (index: number) => void;
  onClose: () => void;
}) {
  const first = layout.cells[0];
  const last = layout.cells[layout.cells.length - 1];

  return (
    <SceneShell active={active}>
      <div data-dim={open !== null} className="scene-meta">
        <p className="label fade absolute" style={{ left: `${first.x}%`, top: `calc(${first.y}% - 2.2rem)` }}>
          03 // Projets
        </p>
        <p
          className="label fade absolute text-right"
          style={{ right: `${100 - last.x - last.w}%`, top: `calc(${first.y}% - 2.2rem)` }}
        >
          {String(projects.length).padStart(2, "0")} réalisations
        </p>
      </div>

      {open !== null && (
        <button type="button" aria-label="Fermer le projet" onClick={onClose} className="absolute inset-0 z-[4] cursor-default" />
      )}

      {projects.map((project, i) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={i}
          rect={open === i ? layout.frame : layout.cells[i]}
          isOpen={open === i}
          dimmed={open !== null && open !== i}
          onOpen={() => onOpen(i)}
          onClose={onClose}
        />
      ))}
    </SceneShell>
  );
}

function ProjectCard({
  project,
  index,
  rect,
  isOpen,
  dimmed,
  onOpen,
  onClose,
}: {
  project: Project;
  index: number;
  rect: Rect;
  isOpen: boolean;
  dimmed: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const openRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // Move focus into the enlarged card, and back to its trigger once it closes.
  useEffect(() => {
    if (isOpen) closeRef.current?.focus({ preventScroll: true });
    else if (wasOpen.current) openRef.current?.focus({ preventScroll: true });
    wasOpen.current = isOpen;
  }, [isOpen]);

  const [base, a, b, c] = project.palette;
  const number = String(index + 1).padStart(2, "0");

  return (
    <article
      data-open={isOpen}
      data-dim={dimmed}
      aria-label={`${number} // ${project.title}`}
      className="pcard"
      style={{ left: `${rect.x}%`, top: `${rect.y}%`, width: `${rect.w}%`, height: `${rect.h}%`, "--i": index } as Vars}
    >
      <div className="pcard-inner">
        <div
          aria-hidden
          className="pcard-visual"
          style={{
            background: `radial-gradient(55% 65% at 28% 38%, ${a}, transparent 70%), radial-gradient(45% 55% at 74% 62%, ${b}, transparent 70%), radial-gradient(35% 40% at 60% 18%, ${c}, transparent 70%), ${base}`,
          }}
        />
        <div aria-hidden className="grain" />
        <div aria-hidden className="pcard-shade" />
        <span aria-hidden className="pcard-focus" />

        <div className="pcard-top">
          <span>{number}</span>
          <span className="pcard-tags">{project.tags.join(" + ")}</span>
        </div>

        <div className="pcard-bottom">
          <div>
            <h2 className="pcard-title">
              {`${number} // ${project.title}`}
            </h2>
            <p className="pcard-sector">
              {project.sector} · {project.year}
            </p>
          </div>
          <div className="pcard-detail" aria-hidden={!isOpen}>
            <p>{project.description}</p>
            <p className="pcard-detail-tags">{project.tags.join(" + ")}</p>
          </div>
        </div>

        {isOpen ? (
          <button ref={closeRef} type="button" onClick={onClose} className="pcard-close">
            Fermer ✕
          </button>
        ) : (
          <button
            ref={openRef}
            type="button"
            onClick={onOpen}
            aria-label={`Agrandir ${project.title}`}
            disabled={dimmed}
            className="absolute inset-0 cursor-pointer"
          />
        )}
      </div>
    </article>
  );
}
