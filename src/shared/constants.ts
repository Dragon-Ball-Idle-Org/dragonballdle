export type CreatorRole = "frontend" | "analytics" | "fullstack";

export interface SocialLink {
  type: "linkedin" | "github" | "x" | "instagram" | "portfolio";
  url: string;
}

export interface Maintainer {
  name: string;
  role: CreatorRole;
  image?: string;
  links: SocialLink[];
}

export const SOCIAL_LINKS_MAINTAINERS: Maintainer[] = [
  {
    name: "Arthur Coelho",
    role: "frontend",
    image: "https://cdn.dragonballdle.site/creators/arthur.jpg",
    links: [
      {
        type: "linkedin",
        url: "https://www.linkedin.com/in/arthur-coelho-9a77a1216/",
      },
    ],
  },
  {
    name: "Júlio Villa",
    role: "analytics",
    image: "https://cdn.dragonballdle.site/creators/julio.jpg",
    links: [
      {
        type: "linkedin",
        url: "https://www.linkedin.com/in/j%C3%BAlio-villa-pires-2678431b8/",
      },
    ],
  },
  {
    name: "Gildo Junior",
    role: "fullstack",
    image: "https://cdn.dragonballdle.site/creators/gildo-junior.jpg",
    links: [
      {
        type: "portfolio",
        url: "https://gildofj.dev",
      },
      {
        type: "linkedin",
        url: "https://www.linkedin.com/in/gildofj/",
      },
      {
        type: "instagram",
        url: "https://www.instagram.com/gildo.fj/",
      },
      {
        type: "x",
        url: "https://x.com/gildofj",
      },
      {
        type: "github",
        url: "https://github.com/gildofj",
      },
    ],
  },
];
