"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postVisitRecord } from "@/services/api/record/recordApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";
import type { SaveVisitRecordRequest } from "@/types/record";

interface SaveVisitRecordVariables extends SaveVisitRecordRequest {
  visitId: number;
}

/** 방문 기록(사진·메모) 저장. 성공 시 팀 방문 기록 캐시 무효화로 목록 갱신. */
const useSaveVisitRecordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ visitId, memo, photos }: SaveVisitRecordVariables) =>
      postVisitRecord(visitId, { memo, photos }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECORD.ALL });
    },
  });
};

export default useSaveVisitRecordMutation;