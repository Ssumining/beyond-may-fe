import { useMutation } from "@tanstack/react-query";
import { postJoin } from "@/services/api/exploration/explorationApi";
import useSessionStore from "@/stores/sessionStore";

const useJoinMutation = () => {
  const setExplorationId = useSessionStore((state) => state.setExplorationId);
  return useMutation({
    mutationFn: (courseId: string) => postJoin(courseId),
    onSuccess: (data) => {
      setExplorationId(data.explorationId); // 합류 응답 explorationId 저장
    },
  });
};

export default useJoinMutation;
