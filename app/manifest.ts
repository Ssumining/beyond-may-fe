import type { MetadataRoute } from "next";

const manifest = (): MetadataRoute.Manifest => ({
  name: "5월 너머의 광주",
  short_name: "5월 너머",
  description: "광주 5·18 테마 여행, 광주 동행 지도",
  start_url: "/",
  display: "standalone",
  background_color: "#FDFFF9",
  theme_color: "#E74D22",
  icons: [
    {
      src: "/icons/icon-192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "/icons/icon-512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
});

export default manifest;
