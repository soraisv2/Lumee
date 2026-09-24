import Link from "next/link";

export function Header() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
      <div className="flex items-center justify-between px-5 py-5 md:px-10 md:py-7">
        <Link
          href="/"
          aria-label="Lumee — Accueil"
          className="pointer-events-auto flex items-center gap-2.5 text-lg font-medium tracking-[-0.03em]"
        >
          <span aria-hidden className="size-2.5 rounded-full bg-white shadow-[0_0_14px_3px_rgb(255_255_255/0.55)]" />
          Lumee
        </Link>
        <nav aria-label="Navigation principale" className="pointer-events-auto flex items-center gap-8 text-sm">
          <Link href="/#travaux" className="link-line hidden md:inline">
            Travaux
          </Link>
          <Link href="/#manifeste" className="link-line hidden md:inline">
            Manifeste
          </Link>
          <Link
            href="/#contact"
            className="rounded-full border border-white/40 px-4 py-2 transition-colors duration-500 hover:bg-white hover:text-black"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
