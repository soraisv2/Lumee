import Link from "next/link";
import type { SceneId } from "./scenes";
import { Reveal } from "./Reveal";

const EMAIL = "contact@lumee.fr";

type Vars = React.CSSProperties & Record<`--${string}`, number>;

export function SceneShell({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <section data-active={active} inert={!active} className="scene absolute inset-0 z-30">
      {children}
    </section>
  );
}

export function SceneContent({ id, active }: { id: Exclude<SceneId, "projets">; active: boolean }) {
  return (
    <SceneShell active={active}>
      {id === "index" && <IndexScene />}
      {id === "studio" && <StudioScene />}
      {id === "contact" && <ContactScene />}
    </SceneShell>
  );
}

function IndexScene() {
  return (
    <>
      <p className="label fade absolute top-[13%] left-[calc(36%+2.4vw)]">01 // Index</p>
      <p className="label fade vertical absolute top-[13%] left-[calc(36%-2.2vw)]">Sites web sur-mesure</p>
      <h1 className="absolute bottom-[calc(26%+3vh)] left-[calc(36%+2.4vw)] text-[clamp(2.8rem,min(8.6vw,15vh),10rem)] leading-[0.9] font-extrabold tracking-[-0.03em] uppercase">
        <Reveal lines={["Sortez", "du flou."]} />
      </h1>
      <p
        className="fade absolute top-[calc(74%+3vh)] left-[calc(36%+2.4vw)] max-w-[25rem] pr-6 text-sm leading-relaxed text-white/75 md:text-base"
        style={{ "--i": 3 } as Vars}
      >
        Lumee conçoit des sites nets, rapides et inoubliables pour les marques qui refusent de se fondre dans le décor.
      </p>
      <p className="label fade absolute bottom-[calc(26%+2vh)] left-[6%] hidden md:block">Studio web // ©2026</p>
    </>
  );
}

function StudioScene() {
  return (
    <>
      <p className="label fade absolute top-[13%] left-[calc(11%+1.2vw)]">02 // Studio</p>
      <p
        className="fade absolute bottom-[calc(42%+3vh)] left-[calc(11%+1.2vw)] max-w-[24rem] pr-6 text-sm leading-relaxed text-white/85 md:text-base"
        style={{ "--i": 7 } as Vars}
      >
        Un seul interlocuteur, du premier appel à la mise en ligne. Pas de template, pas de détour : chaque site part
        d&apos;une page blanche.
      </p>
      <div
        className="fade absolute top-[calc(58%+2.4vh)] left-[calc(11%+1.2vw)] max-w-[min(26rem,calc(56%-2.4vw))]"
        style={{ "--i": 9 } as Vars}
      >
        <p className="label">L&apos;IA chez Lumee</p>
        <p className="mt-3 text-sm leading-relaxed text-white/90 md:text-base">
          Un outil de notre atelier, jamais un argument de vente. Elle nous fait gagner du temps ; les décisions, elles,
          restent humaines.
        </p>
        <Link href="/studio/ia" scroll={false} className="pill mt-5">
          En savoir plus sur l&apos;IA et Lumee <span aria-hidden>→</span>
        </Link>
      </div>
      <h1 className="absolute top-[calc(58%+2.4vh)] left-[calc(67%+0.9vw)] text-[clamp(1.1rem,min(2.7vw,4.1vh),3.2rem)] leading-[1.02] tracking-[-0.01em] uppercase">
        <Reveal
          lines={[
            <span key="a" className="font-light">Un studio</span>,
            <span key="b" className="font-light">à taille</span>,
            <span key="c" className="font-light">humaine,</span>,
            <span key="d" className="font-light">des sites</span>,
            <span key="e" className="font-extrabold">sans</span>,
            <span key="f" className="font-extrabold">compromis.</span>,
          ]}
        />
      </h1>
    </>
  );
}

function ContactScene() {
  return (
    <>
      <p className="label fade absolute top-[13%] left-[calc(6%+1.2vw)]">04 // Contact</p>
      <h1 className="absolute top-[calc(46%+3vh)] left-[calc(6%+1.2vw)] text-[clamp(2.2rem,min(5.6vw,9vh),6.5rem)] leading-[0.95] tracking-[-0.02em] uppercase">
        <Reveal
          lines={[
            <span key="a" className="font-light">Parlons</span>,
            <span key="b" className="font-light">de votre</span>,
            <span key="c" className="font-extrabold">projet.</span>,
          ]}
        />
      </h1>
      <div className="fade absolute top-[calc(46%+3vh)] left-[calc(50%+1.2vw)] pr-6" style={{ "--i": 3 } as Vars}>
        <p className="label">Écrire</p>
        <a
          href={`mailto:${EMAIL}`}
          className="mt-3 block text-[clamp(1.1rem,2.2vw,2.4rem)] font-semibold tracking-[-0.02em] underline-offset-8 hover:underline"
        >
          {EMAIL}
        </a>
        <p className="mt-3 text-sm text-white/70">Réponse sous 24 h ouvrées.</p>
      </div>
    </>
  );
}
