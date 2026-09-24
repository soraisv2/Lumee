import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line px-5 pt-12 md:px-10">
      <div className="flex flex-col gap-6 text-sm text-mute md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Lumee. Tous droits réservés.</p>
        <nav aria-label="Pied de page" className="flex flex-wrap gap-x-8 gap-y-3">
          <a href={`mailto:${site.email}`} className="link-line hover:text-bone">
            {site.email}
          </a>
          <Link href="/mentions-legales" className="link-line hover:text-bone">
            Mentions légales
          </Link>
        </nav>
      </div>
      <p
        aria-hidden
        className="mt-10 translate-y-[18%] select-none bg-linear-to-b from-bone/80 to-bone/0 bg-clip-text text-center text-[31vw] leading-[0.8] font-medium tracking-[-0.07em] text-transparent"
      >
        Lumee
      </p>
    </footer>
  );
}
