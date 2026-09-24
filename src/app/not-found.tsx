import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";

export default function NotFound() {
  return (
    <section className="relative grid min-h-svh place-items-center overflow-hidden px-5 text-center">
      <div
        aria-hidden
        className="glow pointer-events-none absolute top-1/2 left-1/2 size-[min(80vw,40rem)] rounded-full bg-[radial-gradient(circle,rgb(242_197_124/0.18),transparent_65%)] blur-2xl"
      />
      <div className="relative">
        <p className="eyebrow">Erreur 404</p>
        <h1 className="mt-6 text-[clamp(2.6rem,8vw,8rem)] leading-[0.9] font-medium tracking-[-0.05em]">
          Cette page est restée
          <br />
          dans l&apos;ombre.
        </h1>
        <Link href="/" className="btn btn-primary mt-12">
          Retour à la lumière
          <Arrow className="btn-arrow" />
        </Link>
      </div>
    </section>
  );
}
