"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyPreference } from "@/services/api/preference/preferenceApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";

/**
 * 나의 성향 조회 (GET /users/me/preference).
 * 로그인 상태에서 세션에 preferenceType이 없을 때만 활성화해, 다른 기기 로그인 등으로
 * 세션에서 유형이 빠진 경우 사이드바 등에 다시 보여줄 값을 서버에서 복구한다.
 */
const useGetMyPreferenceQuery = (enabled: boolean) =>
  useQuery({
    queryKey: QUERY_KEYS.PREFERENCE.ME(),
    queryFn: getMyPreference,
    enabled,
    staleTime: Infinity,
    retry: false,
  });

export default useGetMyPreferenceQuery;
