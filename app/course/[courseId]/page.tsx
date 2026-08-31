"use client";

import { use } from "react";

import CourseMapView from "@/features/course/components/CourseMapView";
import { useGetCourseDetailQuery } from "@/hooks/queries/useGetCourseDetailQuery";

interface CoursePageProps {
  params: Promise<{ courseId: string }>;
}

/**
 * 추천 코스 지도 화면 (기능명세 3.1.1).
 * courseId로 코스를 조회해 지도·요약 패널을 렌더한다.
 */
const CoursePage = ({ params }: CoursePageProps) => {
  const { courseId } = use(params);
  const {
    data: course,
    isLoading,
    isError,
  } = useGetCourseDetailQuery(courseId);

  if (isLoading)
    return <div className="text-neutral-04 p-6">코스 불러오는 중…</div>;
  if (isError || !course)
    return <div className="text-neutral-04 p-6">코스를 불러오지 못했어요.</div>;

  return <CourseMapView course={course} />;
};

export default CoursePage;
