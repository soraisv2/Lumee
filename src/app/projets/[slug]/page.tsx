import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNextProject, getProject, projects } from "@/data/projects";
import { ProjectVisual } from "@/components/work/ProjectVisual";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projets/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.client} — Étude de cas`,
    description: `${project.tagline} ${project.challenge}`,
  };
}

export default async function ProjectPage({ params }: PageProps<"/projets/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const next = getNextProject(slug);

  const meta = [
    { label: "Secteur", value: project.sector },
    { label: "Année", value: String(project.year) },
    { label: "Prestations", value: project.services.join(", ") },
    { label: "Site", value: project.domain },
  ];

  return (
    <article className="px-5 pt-32 md:px-10 md:pt-44">
      <Link href="/#travaux" className="eyebrow group inline-flex items-center gap-2 hover:text-bone">
        <Arrow direction="left" className="transition-transform duration-500 ease-out-expo group-hover:-translate-x-1" />
        Tous les projets
      </Link>

      <header className="mt-12 md:mt-16">
        <p className="eyebrow fade-up flex flex-wrap gap-x-4 gap-y-2 [--delay:100ms]">
          {project.tags.map((tag) => (
            <span key={tag} className="flex items-center gap-2">
              <span aria-hidden className="size-1.5 rounded-full bg-lumen" />
              {tag}
            </span>
          ))}
        </p>
        <h1 className="mt-6 text-[clamp(3.2rem,12vw,13rem)] leading-[0.85] font-medium tracking-[-0.055em]">
          <span className="line-mask">
            <span className="[--delay:150ms]">{project.client}</span>
          </span>
        </h1>
        <p className="fade-up mt-6 text-[clamp(1.6rem,3.4vw,3.2rem)] leading-tight tracking-[-0.03em] text-bone/60 [--delay:400ms]">
          {project.tagline}
        </p>

        <dl className="fade-up mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 [--delay:550ms] md:grid-cols-4">
          {meta.map((item) => (
            <div key={item.label}>
              <dt className="eyebrow">{item.label}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-bone/85">{item.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="fade-up mt-16 overflow-hidden rounded-2xl border border-line [--delay:700ms] md:mt-24 md:rounded-3xl">
        <ProjectVisual project={project} />
      </div>

      <section aria-label="Étude de cas" className="grid gap-16 py-28 md:grid-cols-12 md:gap-10 md:py-44">
        <Reveal className="md:col-span-5">
          <h2 className="eyebrow">Le défi</h2>
          <p className="mt-6 text-2xl leading-snug tracking-[-0.02em] md:text-3xl">{project.challenge}</p>
        </Reveal>
        <Reveal className="md:col-span-5 md:col-start-8 md:mt-40">
          <h2 className="eyebrow">Notre approche</h2>
          <p className="mt-6 text-2xl leading-snug tracking-[-0.02em] md:text-3xl">{project.approach}</p>
        </Reveal>
      </section>

      <section aria-labelledby="resultats" className="border-t border-line pt-10 pb-28 md:pb-44">
        <h2 id="resultats" className="eyebrow">
          Résultats
        </h2>
        <dl className="mt-10 grid gap-10 sm:grid-cols-3">
          {project.results.map((result, i) => (
            <Reveal key={result.label} delay={i * 120}>
              <dt className="text-[clamp(3.5rem,7vw,7rem)] leading-none font-medium tracking-[-0.05em]">
                {result.value}
              </dt>
              <dd className="mt-4 text-sm text-mute">{result.label}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      <Link
        href={`/projets/${next.slug}`}
        className="group relative -mx-5 block overflow-hidden border-t border-line px-5 py-20 md:-mx-10 md:px-10 md:py-32"
      >
        <span className="eyebrow">Projet suivant</span>
        <span className="mt-6 flex items-center justify-between gap-6">
          <span className="text-[clamp(2.8rem,9vw,9rem)] leading-[0.9] font-medium tracking-[-0.05em] transition-colors duration-700 group-hover:text-lumen">
            {next.client}
          </span>
          <span className="grid size-16 shrink-0 place-items-center rounded-full border border-line text-2xl transition-all duration-700 ease-out-expo group-hover:border-lumen group-hover:bg-lumen group-hover:text-ink md:size-24 md:text-3xl">
            <Arrow className="transition-transform duration-700 ease-out-expo group-hover:translate-x-1" />
          </span>
        </span>
      </Link>
    </article>
  );
}
