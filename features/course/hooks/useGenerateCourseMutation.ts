import { useMutation } from "@tanstack/react-query";

import { postCourseGeneration } from "@/services/api/course/courseApi";
import type { CourseResponse } from "@/types/course";

const useGenerateCourseMutation = () =>
  useMutation<CourseResponse, Error, void>({
    mutationFn: postCourseGeneration,
  });

export default useGenerateCourseMutation;
