import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false },
};

const sections = [
  {
    title: "Éditeur du site",
    body: [
      "Lumee — [forme juridique] au capital de [montant] €",
      "Siège social : [adresse complète]",
      "SIRET : [numéro] — TVA intracommunautaire : [numéro]",
      "Directeur de la publication : [nom et prénom]",
      `Contact : ${site.email}`,
    ],
  },
  {
    title: "Hébergement",
    body: ["[Nom de l'hébergeur]", "[Adresse de l'hébergeur]", "[Contact de l'hébergeur]"],
  },
  {
    title: "Propriété intellectuelle",
    body: [
      "L'ensemble des contenus de ce site (textes, visuels, logos, code) est la propriété de Lumee ou de ses clients, et protégé par le droit de la propriété intellectuelle. Toute reproduction sans autorisation écrite préalable est interdite.",
    ],
  },
  {
    title: "Données personnelles",
    body: [
      "Ce site ne dépose aucun cookie publicitaire ni traceur de mesure d'audience. Les informations que vous nous transmettez par e-mail sont utilisées uniquement pour répondre à votre demande et ne sont jamais cédées à des tiers.",
      `Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour l'exercer, écrivez-nous à ${site.email}.`,
    ],
  },
];

export default function MentionsLegales() {
  return (
    <article className="px-5 pt-32 pb-28 md:px-10 md:pt-44 md:pb-44">
      <div className="grid gap-12 md:grid-cols-12">
        <h1 className="text-[clamp(2.8rem,7vw,7rem)] leading-[0.9] font-medium tracking-[-0.05em] md:col-span-5">
          Mentions légales
        </h1>
        <div className="space-y-14 md:col-span-6 md:col-start-7 md:pt-4">
          {sections.map((section) => (
            <section key={section.title} className="border-t border-line pt-6">
              <h2 className="eyebrow">{section.title}</h2>
              <div className="mt-5 space-y-3 leading-relaxed text-bone/80">
                {section.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
