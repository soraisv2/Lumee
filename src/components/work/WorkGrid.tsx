"use client";

import Link from "next/link";
import { useState } from "react";
import { projectTags, type Project, type ProjectTag } from "@/data/projects";
import { ProjectVisual } from "./ProjectVisual";
import { Arrow } from "@/components/ui/Arrow";

type Filter = "Tout" | ProjectTag;

const SPANS = ["md:col-span-7", "md:col-span-5 md:mt-32", "md:col-span-5", "md:col-span-7 md:mt-32"];

function trackSpotlight(event: React.PointerEvent<HTMLElement>) {
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  target.style.setProperty("--x", `${event.clientX - rect.left}px`);
  target.style.setProperty("--y", `${event.clientY - rect.top}px`);
}

export function WorkGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("Tout");
  const visible = filter === "Tout" ? projects : projects.filter((project) => project.tags.includes(filter));
  const filters: Filter[] = ["Tout", ...projectTags.filter((tag) => projects.some((p) => p.tags.includes(tag)))];

  return (
    <div className="mt-20 md:mt-28">
      <div role="group" aria-label="Filtrer les projets" className="flex flex-wrap gap-2">
        {filters.map((item) => {
          const count = item === "Tout" ? projects.length : projects.filter((p) => p.tags.includes(item)).length;
          const active = item === filter;
          return (
            <button
              key={item}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(item)}
              className={`flex h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-500 ${
                active ? "border-bone bg-bone text-ink" : "border-line text-bone/70 hover:border-bone/40 hover:text-bone"
              }`}
            >
              {item}
              <span className={`text-[10px] font-medium tabular-nums ${active ? "text-ink/60" : "text-mute"}`}>
                {String(count).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      <ul className="mt-12 grid gap-x-6 gap-y-16 md:grid-cols-12 md:gap-y-12">
        {visible.map((project, i) => (
          <li
            key={`${filter}-${project.slug}`}
            className={`fade-up ${visible.length === 1 ? "md:col-span-8" : SPANS[i % SPANS.length]}`}
            style={{ "--delay": `${i * 90}ms` } as React.CSSProperties}
          >
            <Link href={`/projets/${project.slug}`} className="group block">
              <div
                onPointerMove={trackSpotlight}
                className="spotlight relative overflow-hidden rounded-2xl border border-line"
              >
                <div className="transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.04]">
                  <ProjectVisual project={project} />
                </div>
              </div>
              <div className="mt-5 flex items-start justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-medium tracking-[-0.03em] md:text-3xl">{project.client}</h3>
                  <p className="mt-1 flex flex-wrap gap-x-2 text-sm text-mute">
                    {[project.sector, ...project.tags].map((item, index) => (
                      <span key={item} className="whitespace-nowrap">
                        {index > 0 && <span aria-hidden className="mr-2">·</span>}
                        {item}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-mute tabular-nums">{project.year}</span>
                  <span className="grid size-11 place-items-center rounded-full border border-line text-bone transition-colors duration-500 group-hover:border-lumen group-hover:bg-lumen group-hover:text-ink">
                    <Arrow direction="up-right" className="transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
