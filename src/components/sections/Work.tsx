import { projects } from "@/data/projects";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { WorkGrid } from "@/components/work/WorkGrid";

const commitments = [
  { value: "0", label: "template. Chaque site part d'une page blanche." },
  { value: "<1 s", label: "de chargement visé, sur mobile comme sur desktop." },
  { value: "6 sem.", label: "en moyenne, du premier appel à la mise en ligne." },
];

export function Work() {
  return (
    <section id="travaux" aria-labelledby="travaux-title" className="scroll-mt-10 px-5 py-28 md:px-10 md:py-44">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <SectionLabel index="01" label="Travaux" />
        </div>
        <div className="md:col-span-9">
          <Reveal>
            <h2
              id="travaux-title"
              className="text-[clamp(2.4rem,6.2vw,6.5rem)] leading-[0.95] font-medium tracking-[-0.045em]"
            >
              Des sites qui marquent,
              <br className="hidden md:block" /> pas des sites qui passent.
            </h2>
          </Reveal>
          <dl className="mt-14 grid gap-8 border-t border-line pt-8 sm:grid-cols-3 md:mt-20">
            {commitments.map((item, i) => (
              <Reveal key={item.value} delay={i * 120}>
                <dt className="text-5xl font-medium tracking-[-0.05em] md:text-6xl">{item.value}</dt>
                <dd className="mt-3 max-w-[16rem] text-sm leading-relaxed text-mute">{item.label}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>

      <WorkGrid projects={projects} />
    </section>
  );
}
