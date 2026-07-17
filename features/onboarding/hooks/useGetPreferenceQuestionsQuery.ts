"use client";

import { useQuery } from "@tanstack/react-query";

import { getPreferenceQuestions } from "@/services/api/preference/preferenceApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";

/**
 * 성향 검사 질문 목록을 조회.
 * 로딩(인트로) 화면은 이 쿼리의 isLoading 동안 노출.
 */
export const useGetPreferenceQuestionsQuery = () =>
  useQuery({
    queryKey: QUERY_KEYS.PREFERENCE.QUESTIONS(),
    queryFn: getPreferenceQuestions,
    staleTime: Infinity, // 세션 내 질문은 바뀌지 않음
  });
