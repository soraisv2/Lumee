import { DepthImage } from "@/components/depth-image";
import { Arrow } from "@/components/ui/Arrow";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative h-svh min-h-[640px] w-full">
      <DepthImage
        image="/depth-statue.jpg"
        depthMap="/depth-statue-depth.png"
        normalMap="/depth-statue-normal.png"
        fit="cover"
        depthSmoothing={3}
        displacement={0.6}
        elevation={0.5}
        lightIntensity={3.6}
        falloff={0.9}
        normalStrength={1}
        detail={0.06}
        specular={0.22}
        shininess={18}
        flatten={0.55}
        ambient={0.07}
        shadowIntensity={0.6}
        shadowSoftness={0.15}
        follow={0.12}
        autoOrbit={false}
        className="absolute inset-0"
      >
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-ink via-ink/70 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center px-5 md:px-10">
          <h1
            id="hero-title"
            className="text-center text-[clamp(2.6rem,min(10.4vw,17svh),11.5rem)] leading-[0.88] font-medium tracking-[-0.05em]"
          >
            <span className="line-mask">
              <span className="[--delay:300ms]">Votre marque,</span>
            </span>
            <span className="line-mask">
              <span className="[--delay:440ms]">mise en lumière.</span>
            </span>
          </h1>
        </div>

        <div className="absolute inset-x-0 bottom-0 px-5 pb-8 md:px-10 md:pb-10">
          <div className="grid gap-8 border-t border-line pt-6 md:grid-cols-12 md:items-end">
            <p className="fade-up max-w-md text-base leading-relaxed text-bone/70 [--delay:800ms] md:col-span-5 md:text-lg">
              Nous concevons des sites sur-mesure, rapides et inoubliables, pour les marques qui refusent de passer
              inaperçues.
            </p>
            <div className="fade-up flex flex-wrap gap-3 [--delay:950ms] md:col-span-6 md:col-start-7 md:justify-end">
              <a href="#travaux" className="btn btn-ghost">
                Voir nos travaux
              </a>
              <a href="#contact" className="btn btn-primary">
                Démarrer un projet
                <Arrow className="btn-arrow" />
              </a>
            </div>
          </div>
        </div>
      </DepthImage>
    </section>
  );
}
