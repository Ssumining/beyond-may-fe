"use client";

import KakaoMap from "@/components/map/Map";
import CourseSummaryPanel from "@/features/course/components/CourseSummaryPanel";
import { getCourseMapData } from "@/features/course/utils/courseMapAdapter";
import type { CourseDetailResponse } from "@/types/course";

interface CourseMapViewProps {
  course: CourseDetailResponse;
  onDetailClick?: () => void;
  onConfirmClick?: () => void;
}

/**
 * 추천 코스 지도 화면 본체.
 * 상단에 코스 지도(순서 핀 + 경로), 하단에 요약 패널을 배치한다.
 * 코스 데이터를 지도 props로 변환하는 일은 어댑터에 위임한다.
 */
const CourseMapView = ({
  course,
  onDetailClick,
  onConfirmClick,
}: CourseMapViewProps) => {
  const { markers, route, center } = getCourseMapData(course.places);

  return (
    <div className="bg-neutral-01 flex h-dvh flex-col">
      <div className="relative flex-1">
        <KakaoMap center={center} markers={markers} route={route} />
      </div>
      <CourseSummaryPanel
        course={course}
        onDetailClick={onDetailClick}
        onConfirmClick={onConfirmClick}
      />
    </div>
  );
};

export default CourseMapView;
