import type { PreferenceType } from "@/types/preference";

/** 유형별 표시 정보 (클라 상수). 설명 카피는 잠정 — 확정 시 교체 */
export const PREFERENCE_META: Record<
  PreferenceType,
  { mbtiName: string; mbtiTag: string[]; mbtiDescription: string }
> = {
  THINKER: {
    mbtiName: "사색러",
    mbtiTag: ["성찰", "역사"],
    mbtiDescription:
      "혼자만의 속도로 도시를 걷는 사람. 조용한 자리에 오래 머물며 하루의 생각을 천천히 정리합니다.",
  },
  FOODIE: {
    mbtiName: "미식러",
    mbtiTag: ["음식", "골목"],
    mbtiDescription:
      "골목 사이 맛을 찾아다니는 사람. 한 끼의 만족으로 여행을 기억합니다.",
  },
  ARTIST: {
    mbtiName: "예술러",
    mbtiTag: ["문화", "예술"],
    mbtiDescription:
      "감각적인 공간과 작품에 끌리는 사람. 도시의 색과 결을 눈에 담습니다.",
  },
  REMEMBERER: {
    mbtiName: "기억러",
    mbtiTag: ["민주화", "추모"],
    mbtiDescription:
      "장소에 담긴 이야기를 따라 걷는 사람. 그 도시의 시간을 기억합니다.",
  },
};