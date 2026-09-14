import { api } from "@/services/lib/axios";
import { API_ENDPOINTS } from "@/services/constant/endpoint";
import type {
  MyPreferenceResponse,
  PreferenceQuestionsResponse,
  PreferenceSubmitRequest,
  PreferenceResultResponse,
} from "@/types/preference";

/**
 * 성향 검사 질문 목록을 가져온다.
 * 인터셉터가 공통 래퍼 { code, data, message }를 반환하므로 res.data로 실제 데이터를 꺼낸다.
 */

export const getPreferenceQuestions =
  async (): Promise<PreferenceQuestionsResponse> => {
    const res = await api.get<PreferenceQuestionsResponse>(
      API_ENDPOINTS.preference.questions,
    );
    return res.data!;
  };

/**
 * 성향 검사 응답 배열을 서버에 제출한다. 결과(유형) 계산은 백엔드가 수행.
 *
 * TODO: userId 확정 후 파라미터/응답 타입 재확인. (backend)
 */

export const postPreferenceResult = async (
  userId: number,
  body: PreferenceSubmitRequest,
): Promise<void> => {
  await api.post<void>(API_ENDPOINTS.preference.submit(userId), body);
};

/**
 * 나의 성향 검사 결과(유형 + 추천 장소)를 조회.
 *
 * TODO: userId 획득 경로 확정 필요 (닉네임 등록 전이라 userId 미확정 가능성). (backend)
 */
export const getPreferenceResult = async (
  userId: number,
): Promise<PreferenceResultResponse> => {
  const res = await api.get<PreferenceResultResponse>(
    API_ENDPOINTS.preference.result(userId),
  );
  return res.data!;
};

/**
 * 나의 성향 조회 — 로그인 사용자 본인의 유형·유형별 점수만 가볍게 조회한다.
 * 세션에 preferenceType이 없는데(다른 기기 로그인 등) 로그인은 되어 있는 경우,
 * 이 값으로 복구해 사이드바 등에 다시 보여줄 때 쓴다.
 */
export const getMyPreference = async (): Promise<MyPreferenceResponse> => {
  const res = await api.get<MyPreferenceResponse>(API_ENDPOINTS.preference.me);
  return res.data!;
};
