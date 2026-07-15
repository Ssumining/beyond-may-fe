import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import Providers from "./providers";

const pretendardJp = localFont({
  src: [
    {
      path: "./fonts/PretendardJP-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/PretendardJP-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/PretendardJP-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    { path: "./fonts/PretendardJP-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-pretendard",
  display: "swap",
});

export const metadata: Metadata = {
  title: "5월 너머의 광주",
  description: "광주 5·18 테마 여행, 광주 동행 지도",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ko" className={pretendardJp.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
