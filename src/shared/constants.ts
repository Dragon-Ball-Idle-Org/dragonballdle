export interface SocialLink {
  type: "linkedin" | "github" | "x" | "instagram" | "portfolio";
  url: string;
}

export interface Maintainer {
  name: string;
  role: string;
  image?: string;
  links: SocialLink[];
}

export const SOCIAL_LINKS_MAINTAINERS: Maintainer[] = [
  {
    name: "Arthur Coelho",
    role: "Front-end Developer",
    links: [
      {
        type: "linkedin",
        url: "https://www.linkedin.com/in/arthur-coelho-9a77a1216/",
      },
    ],
  },
  {
    name: "Júlio Villa",
    role: "WebAnalytics Analyst",
    links: [
      {
        type: "linkedin",
        url: "https://www.linkedin.com/in/j%C3%BAlio-villa-pires-2678431b8/",
      },
    ],
  },
  {
    name: "Gildo Junior",
    role: "Full Stack Developer",
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
