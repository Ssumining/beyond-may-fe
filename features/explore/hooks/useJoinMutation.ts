import { useMutation } from "@tanstack/react-query";
import { postJoin } from "@/services/api/exploration/explorationApi";

/**
 * 공유 링크로 탐험에 합류 (4.1.1).
 * courseId로 합류하고, 응답의 explorationId로 이후 탐험 API 호출.
 */
const useJoinMutation = () =>
  useMutation({
    mutationFn: (courseId: string) => postJoin(courseId),
  });

export default useJoinMutation;
