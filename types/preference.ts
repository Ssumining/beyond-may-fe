/**
 * 성향 검사(기능명세 1.1.2 / 1.2.1) 공유 계약.
 *
 * 점수 계산은 전적으로 백엔드 책임이므로, 프론트 타입에는
 * 유형별 가중치·뼈대 질문 여부 같은 필드를 두지 않는다.
 * 프론트는 "질문을 보여주고 응답 배열을 모아 제출"하는 역할만 수행
 *
 * 질문은 20개 풀 중 랜덤 선별된 배열로 내려옴 (개수는 서버 소관)
 */

/** 선택지 라벨. 디자인상 A~D 4지선다지만 명세상 2~4개 가변 */
type OptionLabel = "A" | "B" | "C" | "D";

/** 질문 하나의 선택지 */
interface PreferenceOption {
  optionId: number;
  /** 선택지 표시 순서(1부터) */
  displayOrder: number;
  content: string;
  /** 유형별 가중치 (실응답 포함, 클라 성향 계산용). mock엔 없어 optional */
  thinkerWeight?: number;
  foodieWeight?: number;
  artistWeight?: number;
  remembererWeight?: number;
}

/** 성향 검사 질문 하나 */
interface PreferenceQuestion {
  questionId: number;
  content: string;
  options: PreferenceOption[];
}

/** GET /api/preference-test/questions 응답 데이터 (ApiResponse<T>의 T) */
interface PreferenceQuestionsResponse {
  questions: PreferenceQuestion[];
}

/** 사용자의 개별 응답 (questionId ↔ 고른 optionId) */
interface PreferenceAnswer {
  questionId: number;
  optionId: number;
}

/** POST 결과 제출 요청 바디 */
interface PreferenceSubmitRequest {
  answers: PreferenceAnswer[];
}

/**
 * 성향 유형 식별자. ERD T-MBTI의 mbti_name에 대응.
 * 4가지: 사색러(성찰·역사) / 미식러(음식·골목) / 예술러(문화·예술) / 기억러(민주화·추모)
 */
type PreferenceType = "THINKER" | "FOODIE" | "ARTIST" | "REMEMBERER";

/** 4유형 비율(%) — ERD User의 *_percentage. 결과 화면 참고용 */
interface PreferencePercentages {
  THINKER: number;
  FOODIE: number;
  ARTIST: number;
  REMEMBERER: number;
}

/**
 * 유형별 추천 장소. 
 */
interface RecommendedPlace {
  placeId: number;
  /** 장소 사진 (corePlaces.place_img) */
  placeImg: string;
  /** 간단한 소개 한 줄 (corePlaces.place_intro) */
  placeIntro: string;
  /** 장소명 */
  placeName: string;
  address: string;
  category: string;
}

/**
 * 결과 화면 뷰모델 (서버 응답 아님).
 * me/preference(유형·유형별 점수) + 클라 상수(PREFERENCE_META: 유형명·태그·설명)를 조합,
 * 추천 장소는 GET /places/recommendations로 별도 조회해 결과 페이지에서 조립.
 */
interface PreferenceResultResponse {
  /** 유형 식별자 */
  type: PreferenceType;
  /** 유형명 (T-MBTI.mbti_name) 예: "사색러" */
  mbtiName: string;
  /** 키워드 태그 (T-MBTI.mbti_tag, ARRAYLIST) 예: ["성찰", "역사"] */
  mbtiTag: string[];
  /** 대표 일러스트 (T-MBTI.mbti_img) */
  mbtiImg: string;
  /** 유형 설명 (클라 PREFERENCE_META로 제공) */
  mbtiDescription: string;
  /** 4유형 비율 */
  percentages: PreferencePercentages;
  /** 유형별 추천 장소 (5개 이상) */
  recommendedPlaces: RecommendedPlace[];
}

/**
 * 나의 성향 조회 응답 (GET /api/v1/users/me/preference).
 * 토큰의 주인 기준으로 본인 것만 조회되며 path/query 파라미터가 없다 — 위
 * PreferenceResultResponse(구 GET /users/{userId}/preference, 추천 장소 포함)와
 * 달리 유형·유형별 선택 횟수만 가볍게 담은 별도 계약이다.
 */
interface MyPreferenceResponse {
  userId: number;
  nickname: string;
  preferenceType: PreferenceType;
  thinkerScore: number;
  foodieScore: number;
  artistScore: number;
  remembererScore: number;
}

export type {
  OptionLabel,
  PreferenceOption,
  PreferenceQuestion,
  PreferenceQuestionsResponse,
  PreferenceAnswer,
  PreferenceSubmitRequest,
  PreferenceType,
  PreferencePercentages,
  RecommendedPlace,
  PreferenceResultResponse,
  MyPreferenceResponse,
};
