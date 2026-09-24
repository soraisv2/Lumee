import { site } from "@/lib/site";
import { Arrow } from "@/components/ui/Arrow";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { LitText } from "@/components/ui/LitText";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

const MANIFESTO =
  "Le web déborde de sites qui se ressemblent. Même gabarit, même promesse, même oubli. Nous pensons qu'un site doit se ressentir avant de se lire. Alors nous dessinons chaque écran, nous codons chaque interaction, et nous ne livrons que ce qui nous rend fiers.";

const principles = [
  { title: "Sur-mesure", text: "Aucun thème, aucun template. Votre site naît de votre histoire, pas d'un catalogue." },
  { title: "Rapide", text: "Un beau site qui rame est un site raté. La performance fait partie du design." },
  { title: "Direct", text: "Un seul interlocuteur, du premier appel à la mise en ligne. Pas de détour." },
];

export function Manifesto() {
  return (
    <section id="manifeste" aria-label="Manifeste et contact" className="scroll-mt-10 px-5 md:px-10">
      <div className="grid gap-10 border-t border-line pt-28 md:grid-cols-12 md:pt-44">
        <div className="md:col-span-3">
          <SectionLabel index="02" label="Manifeste" />
        </div>
        <div className="md:col-span-9">
          <LitText
            text={MANIFESTO}
            className="text-[clamp(1.9rem,4.4vw,4.6rem)] leading-[1.08] font-medium tracking-[-0.035em]"
          />
          <ol className="mt-20 grid gap-10 border-t border-line pt-10 sm:grid-cols-3 md:mt-28">
            {principles.map((principle, i) => (
              <li key={principle.title}>
                <Reveal delay={i * 120}>
                  <span className="text-xs font-medium text-lumen tabular-nums">0{i + 1}</span>
                  <h3 className="mt-4 text-2xl font-medium tracking-[-0.03em]">{principle.title}</h3>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-mute">{principle.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div id="contact" className="relative scroll-mt-0 py-32 text-center md:py-52">
        <div
          aria-hidden
          className="glow pointer-events-none absolute top-1/2 left-1/2 size-[min(90vw,52rem)] rounded-full bg-[radial-gradient(circle,rgb(242_197_124/0.22),transparent_65%)] blur-2xl"
        />
        <div className="relative">
          <Reveal>
            <SectionLabel index="03" label="Contact" />
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mx-auto mt-8 max-w-[14ch] text-[clamp(3rem,9vw,10rem)] leading-[0.9] font-medium tracking-[-0.05em]">
              Allumons votre projet.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mx-auto mt-8 max-w-md text-base leading-relaxed text-bone/70 md:text-lg">
              Racontez-nous votre marque et vos ambitions. Nous revenons vers vous sous 24 heures ouvrées avec une
              première direction.
            </p>
          </Reveal>
          <Reveal delay={300} className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <a href={`mailto:${site.email}?subject=Nouveau%20projet`} className="btn btn-primary h-14 px-7 text-base">
              {site.email}
              <Arrow className="btn-arrow" />
            </a>
            <CopyEmail email={site.email} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
