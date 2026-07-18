"use client";

import { useQuery } from "@tanstack/react-query";

import { getPreferenceResult } from "@/services/api/preference/preferenceApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";

/**
 * 나의 성향 검사 결과(유형 + 추천 장소)를 조회.
 *
 * TODO: userId는 세션/로그인에서 얻어야 하나 현재 미확정. (#13 세션)
 *   지금은 호출부에서 임시 userId를 넘겨 mock 결과를 받는다.
 */

export const useGetPreferenceResultQuery = (userId: number) =>
  useQuery({
    queryKey: QUERY_KEYS.PREFERENCE.RESULT(userId),
    queryFn: () => getPreferenceResult(userId),
    staleTime: Infinity, // 세션 내 결과는 바뀌지 않음
  });
