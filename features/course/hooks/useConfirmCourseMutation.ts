import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postCourseConfirm } from "@/services/api/course/courseApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";
import useSessionStore from "@/stores/sessionStore";
import type { ConfirmCourseResponse } from "@/types/course";

/**
 * 초안 코스를 확정한다 (draft→confirmed).
 * 확정 성공 시: 캐시 무효화(조회 화면 CONFIRMED 갱신) + explorationId 저장(탐험 시작에 사용).
 */
const useConfirmCourseMutation = () => {
  const queryClient = useQueryClient();
  const setExplorationId = useSessionStore((state) => state.setExplorationId);

  return useMutation<ConfirmCourseResponse, Error, string>({
    mutationFn: postCourseConfirm,
    onSuccess: (data, courseId) => {
      setExplorationId(data.explorationId);
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COURSE.DETAIL(courseId),
      });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COURSE.DRAFT(courseId),
      });
    },
  });
};

export default useConfirmCourseMutation;
