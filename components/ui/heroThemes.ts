import type { PreferenceType } from "@/types/preference";

/** 배경 테마 키. 성향이 아직 없으면 "default"(시안 원본의 따뜻한 주황). */
type HeroThemeKey = PreferenceType | "default";

interface HeroTheme {
  /** 배경 바탕색 */
  base: string;
  /** 블러 블롭 9개 (Figma 시안의 레이어 순서 그대로) */
  blobs: readonly string[];
  /** 위·아래로 큰 진한 타원 2개 */
  strong: string;
  /** 동심원 위쪽의 진한 끝색 (아래로 갈수록 투명한 흰색으로 이어진다) */
  glow: string;
  /** 동심원 중앙의 "태양" 점 */
  sun: string;
  /** 스크롤 끝 프레임 오버레이 (위→아래 5단계) */
  finish: readonly [string, string, string, string, string];
}

/** hex 색을 흰색과 섞는다. ratio 0 = 원색, 1 = 흰색. */
const mixWithWhite = (hex: string, ratio: number): string => {
  const value = hex.replace("#", "");
  const channels = [0, 2, 4].map((offset) =>
    parseInt(value.slice(offset, offset + 2), 16),
  );
  const mixed = channels.map((channel) =>
    Math.round(channel + (255 - channel) * ratio)
      .toString(16)
      .padStart(2, "0"),
  );
  return `#${mixed.join("")}`;
};

const createFinish = (glow: string): HeroTheme["finish"] => [
  mixWithWhite(glow, 0.35),
  mixWithWhite(glow, 0.7),
  mixWithWhite(glow, 0.8),
  mixWithWhite(glow, 0.55),
  "#FFFCFC",
];

/**
 * 성향 유형별 배경 팔레트.
 * default는 Figma 메인 시안 값 그대로이고, 나머지는 같은 구조(블롭 9 + 진한 타원 + 동심원 끝색 + 태양)를
 * globals.css의 유형 테마 색(orange/green/blue/purple)에서 파생해 만들었다.
 */
const HERO_THEMES: Record<HeroThemeKey, HeroTheme> = {
  default: {
    base: "#FFE798",
    blobs: [
      "#FFB273",
      "#FFFA96",
      "#F6FFAA",
      "#FFC1C1",
      "#FFF5A8",
      "#FFD676",
      "#FFE7D1",
      "#FFDA6D",
      "#FFD642",
    ],
    strong: "#FF7C25",
    glow: "#FFBF8B",
    sun: "#E74D22",
    finish: createFinish("#FFBF8B"),
  },
  FOODIE: {
    base: "#FFDFB8",
    blobs: [
      "#FFB273",
      "#FFEBC9",
      "#FFF3D6",
      "#FFC9B0",
      "#FFE9C2",
      "#FFCB85",
      "#FFE7D1",
      "#FFC873",
      "#FFB84D",
    ],
    strong: "#FF8A1F",
    glow: "#FFB877",
    sun: "#E5680A",
    finish: createFinish("#FFB877"),
  },
  ARTIST: {
    base: "#EAF5B8",
    blobs: [
      "#BFE27F",
      "#F6FCCB",
      "#F1F9C8",
      "#D9F0D2",
      "#F3FAD5",
      "#DCEE9A",
      "#EAF6DA",
      "#CFE98B",
      "#BFE05F",
    ],
    strong: "#8FD04A",
    glow: "#B9E68C",
    sun: "#3F9B1E",
    finish: createFinish("#B9E68C"),
  },
  REMEMBERER: {
    base: "#D6E2FF",
    blobs: [
      "#9DB7FF",
      "#E6EEFF",
      "#EDF3FF",
      "#D9D2FF",
      "#E1EAFF",
      "#B7CAFF",
      "#E6ECFF",
      "#AEC4FF",
      "#8FB0FF",
    ],
    strong: "#5B86EA",
    glow: "#A9C0FA",
    sun: "#2F5BC7",
    finish: createFinish("#A9C0FA"),
  },
  THINKER: {
    base: "#E2D8FF",
    blobs: [
      "#B79CF2",
      "#F0EAFF",
      "#F5F0FF",
      "#F2CBEA",
      "#EBE2FF",
      "#CDBBFA",
      "#EFE6FF",
      "#C3ADF7",
      "#A98BF0",
    ],
    strong: "#7A5AE8",
    glow: "#B6A2F4",
    sun: "#4B2FBF",
    finish: createFinish("#B6A2F4"),
  },
};

export type { HeroTheme, HeroThemeKey };
export default HERO_THEMES;
