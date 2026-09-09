import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postVisitPhoto } from "@/services/api/record/recordApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";
import type {
  UploadVisitPhotoResponse,
  VisitedPlaceRecordListResponse,
} from "@/types/record";

interface UploadVisitPhotoVariables {
  visitId: number;
  photo: File;
}

/** 방문 장소 인증 사진 업로드. 성공 시 방문 목록 캐시의 photoUrl을 바로 갱신한다. */
const useUploadVisitPhotoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UploadVisitPhotoResponse,
    Error,
    UploadVisitPhotoVariables
  >({
    mutationFn: ({ visitId, photo }) => postVisitPhoto(visitId, photo),
    onSuccess: ({ visitId, photoUrl }) => {
      queryClient.setQueryData<VisitedPlaceRecordListResponse>(
        QUERY_KEYS.RECORD.VISITS(),
        (current) =>
          current && {
            visits: current.visits.map((visit) =>
              visit.visitId === visitId ? { ...visit, photoUrl } : visit,
            ),
          },
      );
    },
  });
};

export default useUploadVisitPhotoMutation;
