import { useMutation } from "@tanstack/react-query";

import { postStart } from "@/services/api/exploration/explorationApi";
import type { StartResponse } from "@/types/exploration";

/**
 * 탐험을 시작한다 (기능명세 4.2.4). BEFORE → ONGOING 전환.
 * 확정 코스에서 '탐험 시작' 시 호출하며, 응답 explorationId로 팀 탐험 지도(4.3.1)에 진입한다.
 */
const useStartExplorationMutation = () =>
  useMutation<StartResponse, Error, string>({
    mutationFn: postStart,
  });

export default useStartExplorationMutation;
