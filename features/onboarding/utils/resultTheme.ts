import type { PreferenceType } from "@/types/preference";

/**
 * 성향 유형별 공유 카드 테마.
 *
 * globals.css의 --color-type-*는 유형별 대표색 1개만 정의하지만,
 * 공유 카드 배경은 Figma 목업 기준 2색 그라디언트라 두 색 다 필요하다.
 * 값은 새로 만들지 않고 globals.css의 --color-theme-* 토큰(각 유형의 밝은/진한 쪽)을
 * var()로 그대로 참조한다.
 */
interface ResultTheme {
  /** 카드 배경 그라디언트 (왼쪽 → 오른쪽) */
  gradientFrom: string;
  gradientTo: string;
  /** 배경이 밝은 톤(예술러/미식러)이라 글자를 어둡게(neutral-07) 써야 하면 true */
  isLight: boolean;
  /**
   * 유형 대표색(흰 배경 위에 단색으로 쓸 때, 예: 결과 페이지 우표).
   * globals.css의 --color-type-*와 같은 값이지만 그 변수는 어떤 Tailwind
   * 클래스도 참조하지 않아 빌드 시 트리셰이킹되어 사라지므로,
   * 실제로 CSS에 남는 --color-theme-*를 같은 매핑으로 직접 참조한다.
   */
  accent: string;
  /**
   * 유형별 기본 우표 사진 (public/images). API의 mbtiImg가 아직 없을 때 대신 쓴다.
   * public 폴더 기준 루트 상대 경로라 클론한 다른 환경에서도 그대로 동작한다.
   */
  image: string;
}

const RESULT_THEME: Record<PreferenceType, ResultTheme> = {
  thinker: {
    gradientFrom: "var(--color-theme-purple-01)",
    gradientTo: "var(--color-theme-purple-02)",
    isLight: false,
    accent: "var(--color-theme-purple-01)",
    image: "/images/thinker.png",
  },
  artist: {
    gradientFrom: "var(--color-theme-green-01)",
    gradientTo: "var(--color-theme-green-02)",
    isLight: true,
    accent: "var(--color-theme-green-02)",
    image: "/images/artist.png",
  },
  foodie: {
    gradientFrom: "var(--color-theme-orange-02)",
    gradientTo: "var(--color-theme-orange-01)",
    isLight: true,
    accent: "var(--color-theme-orange-01)",
    image: "/images/foodie.png",
  },
  remember: {
    gradientFrom: "var(--color-theme-blue-01)",
    gradientTo: "var(--color-theme-blue-02)",
    isLight: false,
    accent: "var(--color-theme-blue-02)",
    image: "/images/remember.png",
  },
};

export const getResultTheme = (type: PreferenceType): ResultTheme =>
  RESULT_THEME[type];

/**
 * 4유형 비율(percentages) 표시용 라벨.
 * API 응답(mbtiName)은 "결정된" 유형 하나에 대해서만 내려오므로,
 * 비율 목록 전체를 그리려면 4유형 이름을 프론트에서 알고 있어야 한다.
 */
export const PREFERENCE_TYPE_LABEL: Record<PreferenceType, string> = {
  thinker: "사색러",
  foodie: "미식러",
  artist: "예술러",
  remember: "기억러",
};
