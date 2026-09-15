import { useMutation } from "@tanstack/react-query";
import { postLeaveExploration } from "@/services/api/exploration/explorationApi";

/** 탐험 이탈 (6.4.1). "나가고 새 지도 참여하기"에서 사용. */
const useLeaveExplorationMutation = () =>
  useMutation({
    mutationFn: (explorationId: string) => postLeaveExploration(explorationId),
  });

export default useLeaveExplorationMutation;
