// Contenu fictif de démonstration — à remplacer par de vrais projets avant la mise en ligne.

export const projectTags = ["Site vitrine", "E-commerce", "Branding", "Refonte"] as const;
export type ProjectTag = (typeof projectTags)[number];

export type VisualLayout = "editorial" | "split" | "orb" | "mosaic";

export interface Project {
  slug: string;
  client: string;
  sector: string;
  year: number;
  tagline: string;
  domain: string;
  tags: ProjectTag[];
  services: string[];
  layout: VisualLayout;
  palette: { bg: string; surface: string; fg: string; accent: string };
  challenge: string;
  approach: string;
  results: { value: string; label: string }[];
}

export const projects: Project[] = [
  {
    slug: "maison-solene",
    client: "Maison Solène",
    sector: "Maroquinerie artisanale",
    year: 2026,
    tagline: "Le cuir, lentement.",
    domain: "maisonsolene.fr",
    tags: ["E-commerce", "Branding"],
    services: ["Identité visuelle", "Direction artistique", "E-commerce sur-mesure"],
    layout: "editorial",
    palette: { bg: "#1c1511", surface: "#241b16", fg: "#f3e6d8", accent: "#e3a877" },
    challenge:
      "Un atelier reconnu pour son savoir-faire, mais une boutique en ligne qui ressemblait à toutes les autres. Les pièces, pourtant uniques, se perdaient dans un catalogue sans âme.",
    approach:
      "Nous avons pensé la boutique comme un magazine : de grandes images, un rythme lent, des fiches produit qui racontent l'atelier. Chaque interaction a été dessinée pour donner envie de toucher.",
    results: [
      { value: "×2,4", label: "Taux de conversion" },
      { value: "+68 %", label: "Panier moyen" },
      { value: "0,9 s", label: "Chargement moyen" },
    ],
  },
  {
    slug: "atelier-nord",
    client: "Atelier Nord",
    sector: "Architecture",
    year: 2025,
    tagline: "Bâtir avec la lumière du nord.",
    domain: "ateliernord.archi",
    tags: ["Site vitrine", "Refonte"],
    services: ["Refonte complète", "Design d'interface", "Développement"],
    layout: "split",
    palette: { bg: "#0e1418", surface: "#141c21", fg: "#e6eef2", accent: "#9cc4d8" },
    challenge:
      "Des réalisations primées, présentées dans un site vieillissant qui ne laissait respirer ni les volumes, ni les matières. Les appels d'offres se jouaient avant même le premier rendez-vous.",
    approach:
      "Une architecture d'information réduite à l'essentiel et une grille stricte, inspirée des plans de l'agence. Les projets se parcourent comme une visite, pièce après pièce.",
    results: [
      { value: "+140 %", label: "Demandes de contact" },
      { value: "3 min 40", label: "Temps moyen par visite" },
      { value: "100", label: "Score Lighthouse" },
    ],
  },
  {
    slug: "sillage",
    client: "Sillage",
    sector: "Épargne en ligne",
    year: 2025,
    tagline: "L'épargne, enfin claire.",
    domain: "sillage.app",
    tags: ["Site vitrine", "Branding"],
    services: ["Stratégie de marque", "Site marketing", "Motion design"],
    layout: "orb",
    palette: { bg: "#0c0d1a", surface: "#131428", fg: "#eceaff", accent: "#8f8bff" },
    challenge:
      "Une jeune fintech face à des géants rassurants. Il fallait inspirer confiance sans ressembler à une banque, et expliquer un produit technique en quelques secondes.",
    approach:
      "Un univers lumineux et doux, des animations qui rendent les chiffres lisibles, et un parcours qui répond aux doutes dans l'ordre où ils apparaissent.",
    results: [
      { value: "+92 %", label: "Inscriptions" },
      { value: "−38 %", label: "Taux de rebond" },
      { value: "6 sem.", label: "Du brief à la mise en ligne" },
    ],
  },
  {
    slug: "racines",
    client: "Racines",
    sector: "Restaurant gastronomique",
    year: 2026,
    tagline: "Cuisine de saison, sans détour.",
    domain: "racines-restaurant.fr",
    tags: ["Branding", "Site vitrine"],
    services: ["Identité visuelle", "Photographie", "Site & réservation"],
    layout: "mosaic",
    palette: { bg: "#12150e", surface: "#191d13", fg: "#eef0e2", accent: "#c5d47a" },
    challenge:
      "Une table ouverte par un chef reconnu, mais aucune présence en ligne à la hauteur de l'assiette. Les réservations passaient uniquement par le téléphone.",
    approach:
      "Une identité végétale et brute, un site court qui met la carte du moment au premier plan, et une réservation intégrée en trois gestes.",
    results: [
      { value: "74 %", label: "Réservations en ligne" },
      { value: "+3 200", label: "Abonnés en 2 mois" },
      { value: "1,1 s", label: "Chargement moyen" },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
}
