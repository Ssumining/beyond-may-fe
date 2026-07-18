/**
 * 성향 검사(기능명세 1.1.2 / 1.2.1) 공유 계약.
 *
 * 점수 계산은 전적으로 백엔드 책임이므로, 프론트 타입에는
 * 유형별 가중치·뼈대 질문 여부 같은 필드를 두지 않는다.
 * 프론트는 "질문을 보여주고 응답 배열을 모아 제출"하는 역할만 수행
 *
 * TODO: 아래는 API 응답 예시(JSON) 확정 전 계약 초안이다. (backend)
 *   - GET /api/preference-test/questions 응답 확정 시 필드명 재확인
 *   - 질문은 20개 풀 중 랜덤 선별된 배열로 내려옴 (개수는 서버 소관)
 */

/** 선택지 라벨. 디자인상 A~D 4지선다지만 명세상 2~4개 가변 */
type OptionLabel = "A" | "B" | "C" | "D";

/** 질문 하나의 선택지 */
interface PreferenceOption {
  optionId: number;
  label: OptionLabel;
  text: string;
}

/** 성향 검사 질문 하나 */
interface PreferenceQuestion {
  questionId: number;
  /** 화면 표시 순서(1부터). 진행률 계산은 서버가 준 전체 개수 기준 */
  order: number;
  text: string;
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
type PreferenceType = "thinker" | "foodie" | "artist" | "remember";

/** 4유형 비율(%) — ERD User의 *_percentage. 결과 화면 참고용 */
interface PreferencePercentages {
  thinker: number;
  foodie: number;
  artist: number;
  remember: number;
}

/**
 * 유형별 추천 장소. ERD corePlaces 기반.
 * TODO: 결과 조회에 포함할지, 별도 API로 뺄지 확정. (backend)
 */
interface RecommendedPlace {
  placeId: number;
  /** 장소 사진 (corePlaces.place_img) */
  placeImg: string;
  /** 간단한 소개 한 줄 (corePlaces.place_intro) */
  placeIntro: string;
  /** 장소명 — TODO: corePlaces에 이름 필드 확인 (현재 ERD엔 명시 없음) (backend) */
  placeName: string;
  address: string;
  category: string;
}

/**
 * GET /api/users/{userId}/preference 응답 데이터 (ApiResponse<T>의 T).
 * 결정된 유형 정보 + 추천 장소.
 *
 * TODO: mbtiDescription은 ERD T-MBTI에 없는 필드 → 추가 요청 필요. (backend)
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
  /** 유형 설명 텍스트 — ERD에 없음, 백엔드 추가 필요 */
  mbtiDescription: string;
  /** 4유형 비율 */
  percentages: PreferencePercentages;
  /** 유형별 추천 장소 (5개 이상) */
  recommendedPlaces: RecommendedPlace[];
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
};
