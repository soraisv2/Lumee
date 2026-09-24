import Link from "next/link";
import { Reveal } from "./Reveal";
import { SceneShell } from "./SceneContent";

type Vars = React.CSSProperties & Record<`--${string}`, number | string>;

// Brouillon de texte — à valider : ces engagements décrivent la pratique réelle de Lumee.
const points = [
  {
    title: "Ce qu'elle fait",
    text: "Recherche et veille, premiers prototypes, variantes de contenu à tester, vérifications d'accessibilité et de performance, relecture de code.",
  },
  {
    title: "Ce qu'elle ne fait pas",
    text: "Elle ne dessine pas votre identité, n'écrit pas votre voix à votre place et ne tranche rien. Chaque choix de design est humain, argumenté, assumé.",
  },
  {
    title: "Ce que ça change pour vous",
    text: "Des délais plus courts, un budget concentré sur la création, et de la transparence : nous vous disons où et comment elle intervient sur votre projet.",
  },
];

// Frame edges must match aiLayout(): columns at 6 / 35.33 / 64.67 / 94 % and a band
// from 46 to 86 % in landscape, rows at 40 / 56 / 72 / 88 % in portrait. Text always
// sits inside a frame, never across a line.
const COLUMN_LEFT = ["6%", "35.33%", "64.67%"];
const ROW_TOP = ["40%", "56%", "72%"];

export function AiScene({ active }: { active: boolean }) {
  return (
    <SceneShell active={active}>
      <div aria-hidden className="veil" />

      <p className="label fade absolute top-[13%] left-[calc(6%+1.2vw)]">02 — Studio / L&apos;IA</p>
      <Link href="/studio" scroll={false} className="pill fade absolute top-[calc(13%-0.6rem)] right-[6%]">
        Fermer ✕
      </Link>

      <h1 className="absolute top-[18%] left-[calc(6%+1.2vw)] text-[2rem] leading-[0.95] tracking-[-0.02em] uppercase landscape:hidden">
        <Reveal
          lines={[
            <span key="a" className="font-light">L&apos;IA, un outil.</span>,
            <span key="b" className="font-extrabold">Pas un argument.</span>,
          ]}
        />
      </h1>
      <h1 className="absolute bottom-[calc(54%+3vh)] left-[calc(6%+1.2vw)] text-[clamp(1.8rem,min(3.6vw,6.2vh),4.4rem)] leading-[0.95] tracking-[-0.02em] uppercase portrait:hidden">
        <Reveal
          lines={[
            <span key="a" className="font-light">L&apos;IA,</span>,
            <span key="b" className="font-light">un outil.</span>,
            <span key="c" className="font-extrabold">Pas un</span>,
            <span key="d" className="font-extrabold">argument.</span>,
          ]}
        />
      </h1>

      <p
        className="fade absolute top-[calc(18%+5.5rem)] right-[6%] left-[calc(6%+1.2vw)] text-sm leading-relaxed text-white/85 landscape:top-auto landscape:right-auto landscape:bottom-[calc(54%+3vh)] landscape:left-[calc(35.33%+1.2vw)] landscape:w-[calc(29.33%-2.4vw)] md:text-base"
        style={{ "--i": 3 } as Vars}
      >
        Tout le monde met l&apos;IA en vitrine. Chez Lumee, elle reste à l&apos;atelier : elle nous fait gagner du
        temps sur ce qui n&apos;en mérite pas, pour en consacrer davantage à ce qui compte.
      </p>

      {points.map((point, i) => (
        <div
          key={point.title}
          className="fade absolute right-[6%] left-[calc(6%+1.2vw)] top-[calc(var(--row)+1.4vh)] landscape:right-auto landscape:left-[calc(var(--col)+1.2vw)] landscape:top-[calc(46%+3vh)] landscape:w-[calc(29.33%-2.4vw)]"
          style={{ "--i": 4 + i, "--col": COLUMN_LEFT[i], "--row": ROW_TOP[i] } as Vars}
        >
          <span className="text-xs font-medium tabular-nums text-(--accent)">0{i + 1}</span>
          <h2 className="mt-1 text-lg font-semibold tracking-[-0.01em] landscape:mt-4 landscape:text-2xl">{point.title}</h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-white/80 landscape:mt-3 landscape:text-sm landscape:md:text-base">
            {point.text}
          </p>
        </div>
      ))}
    </SceneShell>
  );
}
