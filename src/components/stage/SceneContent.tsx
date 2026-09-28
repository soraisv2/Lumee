import Link from "next/link";
import type { SceneId } from "./scenes";
import { Reveal } from "./Reveal";

// Les [crochets] marquent des informations réelles à compléter avant la mise en ligne.
const EMAIL = "contact@lumee.fr";
const CITY = "[Ville]";

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
      {id === "expertises" && <ExpertisesScene />}
      {id === "contact" && <ContactScene />}
    </SceneShell>
  );
}

function IndexScene() {
  return (
    <>
      <p className="label fade absolute top-[13%] left-[calc(36%+2.4vw)] portrait:left-[calc(8%+2.4vw)]">01 // Index</p>
      <p className="label fade vertical absolute top-[13%] left-[calc(36%-max(2.2vw,1.25rem))] portrait:hidden">
        Sites web sur-mesure
      </p>
      <h1 className="absolute bottom-[calc(26%+3vh)] left-[calc(36%+2.4vw)] text-[clamp(2rem,min(5.6vw,10vh),7.5rem)] leading-[0.9] font-extrabold tracking-[-0.03em] uppercase portrait:left-[calc(8%+2.4vw)] portrait:text-[clamp(1.9rem,8.4vw,4rem)]">
        <Reveal lines={["Atelier", "créatif et", "technologique"]} />
      </h1>
      <p
        className="fade absolute top-[calc(74%+3vh)] left-[calc(36%+2.4vw)] max-w-[36rem] pr-6 text-sm leading-relaxed text-balance text-white/75 portrait:left-[calc(8%+2.4vw)] md:text-base"
        style={{ "--i": 3 } as Vars}
      >
        Pour les marques qui refusent de se fondre dans le décor.
      </p>
      <h2 className="absolute bottom-[calc(26%+3vh)] left-[calc(6%+1.2vw)] text-[clamp(1.1rem,min(2.3vw,4vh),3rem)] leading-[0.95] font-light tracking-[-0.02em] uppercase portrait:top-[44%] portrait:bottom-auto portrait:left-[calc(8%+2.4vw)]">
        <Reveal lines={["Conception web", "// Consulting", "technologique"]} start={2} />
      </h2>
    </>
  );
}

const figures = [
  { value: "[00]", label: "projets mis en ligne" },
  { value: "[00]", label: "ans à façonner le web" },
  { value: "100 %", label: "sur-mesure, zéro template" },
];

function StudioScene() {
  return (
    <>
      <p className="label fade absolute top-[13%] left-[calc(11%+1.2vw)] portrait:left-[calc(6%+1.2vw)]">02 // Studio</p>

      <div
        className="fade absolute bottom-[calc(42%+3vh)] short:bottom-[calc(46%+2vh)] left-[calc(11%+1.2vw)] max-w-[min(30rem,calc(56%-2.4vw))] short:max-w-[calc(51%-2.4vw)] portrait:top-[17%] portrait:right-[6%] portrait:bottom-auto portrait:left-[calc(6%+1.2vw)] portrait:max-w-none"
        style={{ "--i": 7 } as Vars}
      >
        <p className="text-sm leading-relaxed text-white/85 portrait:text-[13px] md:text-base short:text-xs short:leading-snug">
          Le web s&apos;uniformise : mêmes gabarits, mêmes promesses, mêmes sites oubliés aussitôt vus. Nous avons créé
          Lumee pour faire l&apos;inverse. Un seul interlocuteur du premier appel à la mise en ligne, une page blanche
          pour chaque projet, et l&apos;envie de livrer des sites dont nous sommes fiers.
        </p>
        <p className="label mt-4 text-white/70 short:mt-2">[Prénom], fondateur</p>
      </div>

      <dl className="fade absolute top-[13%] left-[calc(67%+0.9vw)] space-y-6 short:left-[calc(62%+0.9vw)] portrait:top-[calc(42%+2vh)] portrait:right-[6%] portrait:left-[calc(6%+1.2vw)] portrait:grid portrait:grid-cols-3 portrait:gap-4 portrait:space-y-0 short:space-y-2.5" style={{ "--i": 8 } as Vars}>
        {figures.map((figure) => (
          <div key={figure.label}>
            <dt className="text-[clamp(1.6rem,3vw,3rem)] leading-none font-extrabold tracking-[-0.03em] tabular-nums short:text-xl">
              {figure.value}
            </dt>
            <dd className="label mt-2 max-w-[14rem] text-white/70 short:mt-1">{figure.label}</dd>
          </div>
        ))}
      </dl>

      <div
        className="fade absolute top-[calc(58%+2.4vh)] short:top-[calc(54%+1.5vh)] left-[calc(11%+1.2vw)] max-w-[min(26rem,calc(56%-2.4vw))] short:max-w-[calc(51%-2.4vw)] portrait:top-[calc(56%+2vh)] portrait:right-[6%] portrait:left-[calc(6%+1.2vw)] portrait:max-w-none"
        style={{ "--i": 9 } as Vars}
      >
        <p className="label">L&apos;IA chez Lumee</p>
        <p className="mt-3 text-sm leading-relaxed text-white/90 portrait:text-[13px] md:text-base portrait:mt-2 portrait:leading-normal short:mt-1 short:text-xs short:leading-snug">
          Un outil de notre atelier, jamais un argument de vente. Elle nous fait gagner du temps ; les décisions, elles,
          restent humaines.
        </p>
        <Link href="/studio/ia" scroll={false} className="pill mt-5 portrait:mt-3 short:mt-2">
          En savoir plus sur l&apos;IA et Lumee <span aria-hidden>→</span>
        </Link>
      </div>

      <h1 className="absolute top-[calc(58%+2.4vh)] left-[calc(67%+0.9vw)] short:top-[calc(54%+1.5vh)] short:left-[calc(62%+0.9vw)] text-[clamp(1.1rem,min(2.7vw,4.1vh),3.2rem)] leading-[1.02] tracking-[-0.01em] uppercase portrait:top-[calc(77%+2vh)] portrait:left-[calc(6%+1.2vw)] portrait:text-[0.9rem] short:text-[0.8rem]">
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

const expertises = [
  {
    title: "Sites vitrines sur-mesure",
    text: "Un site pensé depuis une page blanche pour raconter votre marque : design, animations et contenus taillés pour elle, jamais pour un gabarit.",
    tags: "Design + Développement + Animation",
  },
  {
    title: "E-commerce",
    text: "Des boutiques rapides et soignées, du catalogue au paiement, qui donnent envie d'acheter et restent simples à gérer au quotidien.",
    tags: "Boutique + Paiement + Catalogue",
  },
  {
    title: "Identité & direction artistique",
    text: "Logo, typographies, couleurs, ton : une identité cohérente de l'écran au papier, pour que votre marque se reconnaisse au premier regard.",
    tags: "Logo + Charte + Direction artistique",
  },
  {
    title: "Refonte & performance",
    text: "Votre site ne vous ressemble plus ? Nous le repensons, l'accélérons et le rendons accessible, sans perdre ce qui fonctionne déjà.",
    tags: "Refonte + Vitesse + Accessibilité + SEO",
  },
];

// Frame edges must match the "expertises" scene lines: columns at 6 / 50 / 94 %, rows at 34 / 61 / 88 %.
const FRAMES = [
  { left: "6%", top: "34%" },
  { left: "50%", top: "34%" },
  { left: "6%", top: "61%" },
  { left: "50%", top: "61%" },
];

function ExpertisesScene() {
  return (
    <>
      <p className="label fade absolute top-[13%] left-[calc(6%+1.2vw)]">03 // Expertises</p>
      <h1 className="absolute top-[17%] left-[calc(6%+1.2vw)] text-[clamp(1.7rem,min(3.6vw,6vh),4.2rem)] leading-[0.95] tracking-[-0.02em] uppercase short:top-[calc(13%+1.5rem)] short:text-[clamp(1.2rem,3.4vw,1.7rem)]">
        <Reveal
          lines={[
            <span key="a" className="font-light">Quatre métiers.</span>,
            <span key="b" className="font-extrabold">Une seule exigence.</span>,
          ]}
        />
      </h1>
      <p
        className="fade absolute top-[calc(17%+4.6rem)] right-[6%] left-[calc(6%+1.2vw)] text-[13px] leading-relaxed text-white/80 [@media(orientation:portrait)_and_(max-height:760px)]:hidden landscape:top-auto landscape:right-auto landscape:bottom-[calc(66%+2.4vh)] landscape:left-[calc(50%+1.2vw)] landscape:max-w-[min(26rem,calc(44%-2.4vw))] md:text-base short:text-[11px] short:leading-snug"
        style={{ "--i": 3 } as Vars}
      >
        Au-delà du site, un partenaire : nous restons à vos côtés après la mise en ligne pour le faire évoluer au rythme
        de votre marque.
      </p>

      {expertises.map((expertise, i) => (
        <div
          key={expertise.title}
          className="fade absolute top-[calc(var(--top)+2.4vh)] left-[calc(var(--left)+1.2vw)] w-[calc(44%-2.4vw)] short:top-[calc(var(--top)+1.2vh)]"
          style={{ "--i": 4 + i, "--left": FRAMES[i].left, "--top": FRAMES[i].top } as React.CSSProperties}
        >
          <span className="text-xs font-medium tabular-nums text-(--accent) short:leading-none">0{i + 1}</span>
          <h2 className="mt-2 text-[15px] leading-tight font-semibold tracking-[-0.01em] md:mt-3 md:text-2xl short:mt-0.5 short:text-[15px]">
            {expertise.title}
          </h2>
          <p className="mt-2 text-[11.5px] leading-snug text-white/75 md:mt-3 md:text-sm md:leading-relaxed lg:text-base short:mt-0.5 short:text-[11px] short:leading-snug">{expertise.text}</p>
          <p className="label mt-3 hidden text-white/60 md:block short:hidden">{expertise.tags}</p>
        </div>
      ))}
    </>
  );
}

function ContactScene() {
  return (
    <>
      <p className="label fade absolute top-[13%] left-[calc(6%+1.2vw)]">05 // Contact</p>
      <h1 className="absolute top-[calc(46%+3vh)] left-[calc(6%+1.2vw)] text-[clamp(1.9rem,min(4.8vw,8vh),5.6rem)] leading-[0.95] tracking-[-0.02em] uppercase portrait:top-[calc(36%+2.4vh)]">
        <Reveal
          lines={[
            <span key="a" className="font-light">Ensemble,</span>,
            <span key="b" className="font-light">sortons votre</span>,
            <span key="c" className="font-extrabold">marque</span>,
            <span key="d" className="font-extrabold">du flou.</span>,
          ]}
        />
      </h1>
      <div className="fade absolute top-[calc(46%+3vh)] left-[calc(50%+1.2vw)] pr-6 portrait:top-[calc(64%+2.4vh)] portrait:left-[calc(6%+1.2vw)]" style={{ "--i": 3 } as Vars}>
        <p className="label">Entrer en contact</p>
        <a
          href={`mailto:${EMAIL}`}
          className="mt-3 block short:mt-2 text-[clamp(1.1rem,2.2vw,2.4rem)] font-semibold tracking-[-0.02em] underline-offset-8 hover:underline"
        >
          {EMAIL}
        </a>
        <p className="mt-3 text-sm text-white/70 short:mt-2">Réponse sous 24 h ouvrées.</p>
        <p className="label mt-8 portrait:mt-5 short:mt-3">Le studio</p>
        <p className="mt-2 text-sm text-white/70">[Adresse] // {CITY}</p>
      </div>
    </>
  );
}
