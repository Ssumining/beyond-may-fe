import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchLocationSharing } from "@/services/api/exploration/explorationApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";
import type { LocationSharingRequest } from "@/types/exploration";

/**
 * 내 위치 공유 설정 변경 (4.3.2).
 * 성공 시 참여자 목록·탐험 상태를 invalidate해 본인 상태를 갱신한다.
 */
const useUpdateLocationSharingMutation = (explorationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: LocationSharingRequest) =>
      patchLocationSharing(explorationId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EXPLORATION.PARTICIPANTS(explorationId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EXPLORATION.STATUS(explorationId),
      });
    },
  });
};

export default useUpdateLocationSharingMutation;
