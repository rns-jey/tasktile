import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TaskTile",
    short_name: "TaskTile",
    description:
      "Manage your tasks efficiently with TaskTile, a simple and intuitive to-do list app.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf6f1",
    theme_color: "#faf6f1",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
