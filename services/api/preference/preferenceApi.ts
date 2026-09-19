import { api } from "@/services/lib/axios";
import { API_ENDPOINTS } from "@/services/constant/endpoint";
import type {
  MyPreferenceResponse,
  PreferenceQuestionsResponse,
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
 * 나의 성향 조회 — 로그인 사용자 본인의 유형·유형별 점수만 가볍게 조회한다.
 * 세션에 preferenceType이 없는데(다른 기기 로그인 등) 로그인은 되어 있는 경우,
 * 이 값으로 복구해 사이드바 등에 다시 보여줄 때 쓴다.
 */
export const getMyPreference = async (): Promise<MyPreferenceResponse> => {
  const res = await api.get<MyPreferenceResponse>(API_ENDPOINTS.preference.me);
  return res.data!;
};

interface UpdatePreferenceRequest {
  thinkerScore: number;
  foodieScore: number;
  artistScore: number;
  remembererScore: number;
}

/** 성향 재검사 결과 저장 (로그인 사용자). */
export const putMyPreference = async (
  body: UpdatePreferenceRequest,
): Promise<MyPreferenceResponse> => {
  const res = await api.put<MyPreferenceResponse>(
    API_ENDPOINTS.preference.me, // ← 경로/메서드 백엔드 확인 후 맞추기
    body,
  );
  return res.data!;
};
