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

export type {
  OptionLabel,
  PreferenceOption,
  PreferenceQuestion,
  PreferenceQuestionsResponse,
  PreferenceAnswer,
  PreferenceSubmitRequest,
};
