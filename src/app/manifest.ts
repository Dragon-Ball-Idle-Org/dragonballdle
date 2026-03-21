import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DragonBallDle",
    short_name: "DBDle",
    start_url: "/en-us/",
    display: "standalone",
    background_color: "#fb8c00",
    theme_color: "#fb8c00",
    description:
      "Guess today's Dragon Ball character. Fast, free daily challenge.",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
