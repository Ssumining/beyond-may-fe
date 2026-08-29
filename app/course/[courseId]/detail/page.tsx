"use client";

import { use } from "react";

import CourseTimelineView from "@/features/course/components/CourseTimelineView";
import { useGetCourseDetailQuery } from "@/hooks/queries/useGetCourseDetailQuery";

interface CourseDetailPageProps {
  params: Promise<{ courseId: string }>;
}

/**
 * 코스 타임라인(시간대별 동선) 화면 (기능명세 3.1.2).
 * 지도 화면의 "코스 상세" 진입점. courseId로 조회해 타임라인을 렌더한다.
 */
const CourseDetailPage = ({ params }: CourseDetailPageProps) => {
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

  return <CourseTimelineView course={course} />;
};

export default CourseDetailPage;
