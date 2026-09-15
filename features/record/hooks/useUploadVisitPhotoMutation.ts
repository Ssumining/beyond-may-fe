"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postVisitPhoto } from "@/services/api/record/recordApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";

interface UploadVisitPhotoVariables {
  visitId: number;
  photo: File;
}

/** 방문 인증 사진 업로드(1장). 성공 시 팀 방문 기록 캐시 무효화로 그리드 갱신. */
const useUploadVisitPhotoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ visitId, photo }: UploadVisitPhotoVariables) =>
      postVisitPhoto(visitId, photo),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECORD.ALL });
    },
  });
};

export default useUploadVisitPhotoMutation;