import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Okiro — Progreso en equilibrio",
    short_name: "Okiro",
    description:
      "Registra tus hábitos y conviértelos en progreso personal sostenible.",
    start_url: "/",
    display: "standalone",
    background_color: "#03030a",
    theme_color: "#03030a",
    lang: "es-MX",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
