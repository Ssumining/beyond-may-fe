"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postCompleteExploration } from "@/services/api/exploration/explorationApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";

/** 탐험 조기 완료 (OWNER). 성공 시 상태 캐시 무효화. */
const useCompleteExplorationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (explorationId: string) =>
      postCompleteExploration(explorationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EXPLORATION.ALL,
      });
    },
  });
};

export default useCompleteExplorationMutation;