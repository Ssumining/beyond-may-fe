import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postCourseConfirm } from "@/services/api/course/courseApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";
import type { ConfirmCourseResponse } from "@/types/course";

/**
 * 초안 코스를 확정한다 (draft→confirmed).
 * 확정 성공 시 해당 코스 캐시를 무효화해, 조회 화면이 CONFIRMED로 갱신되게 한다.
 */
const useConfirmCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ConfirmCourseResponse, Error, string>({
    mutationFn: postCourseConfirm,
    onSuccess: (_data, courseId) => {
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
