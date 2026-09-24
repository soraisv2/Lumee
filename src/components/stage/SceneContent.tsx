import type { SceneId } from "./scenes";
import { Reveal } from "./Reveal";

const EMAIL = "contact@lumee.fr";

type Vars = React.CSSProperties & Record<`--${string}`, number>;

export function SceneContent({ id, active }: { id: SceneId; active: boolean }) {
  return (
    <section data-active={active} inert={!active} className="scene absolute inset-0 z-30">
      {id === "index" && <IndexScene />}
      {id === "studio" && <StudioScene />}
      {id === "projets" && <ProjetsScene />}
      {id === "contact" && <ContactScene />}
    </section>
  );
}

function IndexScene() {
  return (
    <>
      <p className="label fade absolute top-[13%] left-[calc(36%+2.4vw)]">01 — Index</p>
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
      <p className="label fade absolute bottom-[calc(26%+2vh)] left-[6%] hidden md:block">Studio web — ©2026</p>
    </>
  );
}

function StudioScene() {
  return (
    <>
      <p className="label fade absolute top-[13%] left-[calc(11%+1.2vw)]">02 — Studio</p>
      <p
        className="fade absolute bottom-[calc(42%+3vh)] left-[calc(11%+1.2vw)] max-w-[24rem] pr-6 text-sm leading-relaxed text-white/85 md:text-base"
        style={{ "--i": 7 } as Vars}
      >
        Un seul interlocuteur, du premier appel à la mise en ligne. Pas de template, pas de détour : chaque site part
        d&apos;une page blanche.
      </p>
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

function ProjetsScene() {
  return (
    <>
      <p className="label fade absolute top-[13%] left-[calc(8%+1.2vw)]">03 — Projets</p>
      <span aria-hidden className="reticle absolute top-[51%] left-1/2" />
      <div className="absolute top-[44%] left-[calc(8%+1.2vw)]">
        <h1 className="text-[clamp(1.6rem,min(3.3vw,6vh),3.8rem)] leading-none font-normal tracking-[-0.02em] uppercase">
          <Reveal lines={["01 — Projet A"]} />
        </h1>
        <dl
          className="fade mt-4 grid grid-cols-[auto_auto_auto] gap-x-6 text-[10px] leading-[1.35] font-semibold tracking-[0.08em] uppercase md:text-xs"
          style={{ "--i": 3 } as Vars}
        >
          <dt>Projet A</dt>
          <dd>+</dd>
          <dd>Identité</dd>
          <dt>E-commerce</dt>
          <dd />
          <dd>Site vitrine</dd>
          <dt>Q2 — 2026</dt>
          <dd>+</dd>
          <dd>En ligne</dd>
        </dl>
      </div>
      <p className="label fade absolute top-[calc(72%+3vh)] left-[calc(60%+1.2vw)]" style={{ "--i": 4 } as Vars}>
        Mise au point — 01 / 03
      </p>
    </>
  );
}

function ContactScene() {
  return (
    <>
      <p className="label fade absolute top-[13%] left-[calc(6%+1.2vw)]">04 — Contact</p>
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
