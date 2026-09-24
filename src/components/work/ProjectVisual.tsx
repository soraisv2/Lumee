import type { Project } from "@/data/projects";

// Decorative browser mockups drawn in CSS, so the portfolio works before
// real screenshots exist. Sizes use container units to scale with the card.
export function ProjectVisual({ project }: { project: Project }) {
  const { palette } = project;

  return (
    <div
      aria-hidden
      className="@container relative aspect-[4/3] w-full overflow-hidden"
      style={{ background: palette.bg, color: palette.fg }}
    >
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(70% 60% at 75% 10%, ${palette.accent}40, transparent 70%)` }}
      />
      <div
        className="absolute inset-x-[8%] top-[11%] bottom-0 overflow-hidden rounded-t-[1.4cqw] border border-b-0 border-white/10 shadow-[0_-2cqw_6cqw_rgb(0_0_0/0.45)]"
        style={{ background: palette.surface }}
      >
        <div className="flex h-[5.5cqw] items-center gap-[0.9cqw] border-b border-white/10 px-[2.2cqw]">
          <span className="size-[1.1cqw] rounded-full bg-white/20" />
          <span className="size-[1.1cqw] rounded-full bg-white/20" />
          <span className="size-[1.1cqw] rounded-full bg-white/20" />
          <span className="mx-auto rounded-full bg-white/[0.06] px-[2.4cqw] py-[0.5cqw] text-[1.5cqw] opacity-60">
            {project.domain}
          </span>
        </div>
        <div className="relative h-full px-[5cqw] pt-[3.2cqw]">
          <MockNav project={project} />
          {project.layout === "editorial" && <Editorial project={project} />}
          {project.layout === "split" && <Split project={project} />}
          {project.layout === "orb" && <Orb project={project} />}
          {project.layout === "mosaic" && <Mosaic project={project} />}
        </div>
      </div>
    </div>
  );
}

function MockNav({ project }: { project: Project }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[1.9cqw] font-medium tracking-tight">{project.client}</span>
      <span className="flex gap-[1.6cqw]">
        {[4, 5, 3.5].map((width, i) => (
          <span key={i} className="h-[0.7cqw] rounded-full bg-current opacity-25" style={{ width: `${width}cqw` }} />
        ))}
      </span>
    </div>
  );
}

function Editorial({ project }: { project: Project }) {
  return (
    <div className="mt-[5cqw] grid grid-cols-[1.1fr_1fr] gap-[4cqw]">
      <div>
        <p className="text-[6.4cqw] leading-[0.95] font-medium tracking-[-0.04em]">{project.tagline}</p>
        <div className="mt-[3cqw] space-y-[1.2cqw]">
          <span className="block h-[0.7cqw] w-[80%] rounded-full bg-current opacity-20" />
          <span className="block h-[0.7cqw] w-[60%] rounded-full bg-current opacity-20" />
        </div>
        <span
          className="mt-[3.5cqw] inline-block rounded-full px-[2.6cqw] py-[1.1cqw] text-[1.5cqw] font-medium"
          style={{ background: project.palette.accent, color: project.palette.bg }}
        >
          Découvrir
        </span>
      </div>
      <div
        className="h-[40cqw] rounded-[1cqw]"
        style={{
          background: `linear-gradient(160deg, ${project.palette.accent} 0%, ${project.palette.accent}55 35%, ${project.palette.bg} 100%)`,
        }}
      />
    </div>
  );
}

function Split({ project }: { project: Project }) {
  return (
    <div className="mt-[4cqw] grid grid-cols-[1fr_1.15fr] gap-[4cqw]">
      <div className="pt-[2cqw]">
        <span className="text-[1.4cqw] tracking-[0.2em] uppercase opacity-50">Projets — 2025</span>
        <p className="mt-[2cqw] text-[5.4cqw] leading-[0.95] font-medium tracking-[-0.04em] uppercase">{project.tagline}</p>
      </div>
      <div className="relative h-[42cqw] overflow-hidden rounded-[0.6cqw]">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(200deg, ${project.palette.accent}cc, ${project.palette.surface} 75%)` }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgb(255 255 255 / 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.5) 1px, transparent 1px)",
            backgroundSize: "6cqw 6cqw",
          }}
        />
        <div className="absolute bottom-0 left-[18%] h-[62%] w-[34%] bg-black/35" />
        <div className="absolute bottom-0 left-[52%] h-[40%] w-[28%] bg-black/25" />
      </div>
    </div>
  );
}

function Orb({ project }: { project: Project }) {
  return (
    <div className="relative mt-[3cqw] flex flex-col items-center text-center">
      <div
        className="absolute top-[2cqw] size-[34cqw] rounded-full blur-[3cqw]"
        style={{ background: `radial-gradient(circle, ${project.palette.accent}, transparent 68%)` }}
      />
      <p className="relative mt-[8cqw] text-[6.2cqw] leading-[0.95] font-medium tracking-[-0.045em]">{project.tagline}</p>
      <div className="relative mt-[4cqw] flex w-[46cqw] items-end justify-between gap-[1.2cqw] rounded-[1.4cqw] border border-white/10 bg-white/[0.04] p-[2.4cqw] backdrop-blur">
        <div className="text-left">
          <span className="block text-[1.4cqw] opacity-50">Votre épargne</span>
          <span className="block text-[3.6cqw] font-medium tracking-tight">12 480 €</span>
        </div>
        <div className="flex h-[8cqw] items-end gap-[0.8cqw]">
          {[35, 50, 42, 64, 58, 80, 100].map((height, i) => (
            <span
              key={i}
              className="w-[1.6cqw] rounded-t-[0.4cqw]"
              style={{ height: `${height}%`, background: project.palette.accent, opacity: 0.35 + i * 0.09 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Mosaic({ project }: { project: Project }) {
  const { accent, bg } = project.palette;
  return (
    <div className="mt-[4cqw]">
      <p className="text-center text-[5.6cqw] leading-none font-medium tracking-[-0.04em]">{project.tagline}</p>
      <div className="mt-[4cqw] grid grid-cols-3 gap-[1.6cqw]">
        {[160, 200, 130].map((angle, i) => (
          <div
            key={i}
            className={`rounded-[1cqw] ${i === 1 ? "h-[34cqw]" : "mt-[4cqw] h-[30cqw]"}`}
            style={{ background: `linear-gradient(${angle}deg, ${accent}${i === 1 ? "dd" : "88"}, ${bg} 90%)` }}
          />
        ))}
      </div>
    </div>
  );
}
