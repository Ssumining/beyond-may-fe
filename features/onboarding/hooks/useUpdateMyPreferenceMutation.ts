"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { putMyPreference } from "@/services/api/preference/preferenceApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";

/** 재검사 결과 저장 후 me/preference 캐시를 새 값으로 갱신 */
const useUpdateMyPreferenceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putMyPreference,
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.PREFERENCE.ME(), data);
    },
  });
};

export default useUpdateMyPreferenceMutation;
