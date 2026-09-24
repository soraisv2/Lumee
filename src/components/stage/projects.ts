// Projets fictifs de démonstration — à remplacer par les vraies réalisations.

export interface Project {
  id: string;
  title: string;
  sector: string;
  tags: string[];
  year: string;
  description: string;
  /** Base colour, then three light pools that stand in for a blurred photo. */
  palette: [string, string, string, string];
}

export const projects: Project[] = [
  {
    id: "a",
    title: "Projet A",
    sector: "Maroquinerie",
    tags: ["Identité", "E-commerce"],
    year: "2026",
    description: "Une boutique pensée comme un magazine : de grandes images, un rythme lent, des fiches qui racontent l'atelier.",
    palette: ["#2a2420", "#8a6a52", "#e3ddd4", "#4f3a2e"],
  },
  {
    id: "b",
    title: "Projet B",
    sector: "Architecture",
    tags: ["Site vitrine", "Refonte"],
    year: "2025",
    description: "Une grille stricte inspirée des plans de l'agence : chaque réalisation se parcourt comme une visite.",
    palette: ["#1b2227", "#9cc4d8", "#3d5566", "#dfe8ec"],
  },
  {
    id: "c",
    title: "Projet C",
    sector: "Fintech",
    tags: ["Branding", "Site"],
    year: "2025",
    description: "Un univers lumineux et doux pour rendre l'épargne lisible, et un parcours qui répond aux doutes dans l'ordre.",
    palette: ["#15142a", "#8f8bff", "#3a3780", "#e8e6ff"],
  },
  {
    id: "d",
    title: "Projet D",
    sector: "Restaurant",
    tags: ["Identité", "Réservation"],
    year: "2026",
    description: "Une identité végétale et brute, la carte du moment au premier plan, la réservation en trois gestes.",
    palette: ["#1c2014", "#c5d47a", "#5c6b2e", "#eef0e2"],
  },
  {
    id: "e",
    title: "Projet E",
    sector: "Céramique",
    tags: ["E-commerce"],
    year: "2026",
    description: "Des pièces uniques mises en scène une à une, avec une boutique aussi calme que l'atelier.",
    palette: ["#2a1614", "#e0785a", "#7a2f24", "#f2d8c9"],
  },
  {
    id: "f",
    title: "Projet F",
    sector: "Studio photo",
    tags: ["Portfolio", "Site"],
    year: "2025",
    description: "Un portfolio qui s'efface derrière les images : plein écran, sans bruit, au rythme du défilement des séries.",
    palette: ["#202224", "#b7b5b1", "#5a5d61", "#f0f0ee"],
  },
];
