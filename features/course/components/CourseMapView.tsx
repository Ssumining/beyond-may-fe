"use client";

import { useState } from "react";

import KakaoMap from "@/components/map/Map";
import CourseListFallback from "@/features/course/components/CourseListFallback";
import CourseSummaryPanel from "@/features/course/components/CourseSummaryPanel";
import { getCourseMapData } from "@/features/course/utils/courseMapAdapter";
import type { CourseResponse } from "@/types/course";

interface CourseMapViewProps {
  course: CourseResponse;
  onDetailClick?: () => void;
  onConfirmClick?: () => void;
}

/**
 * 추천 코스 지도 화면 본체.
 * 상단 영역(지도 또는 폴백)이 남는 공간을 채우고,
 * 하단에 요약 패널이 고정된다. 지도 로드 실패 시 폴백으로 교체한다.
 */
const CourseMapView = ({
  course,
  onDetailClick,
  onConfirmClick,
}: CourseMapViewProps) => {
  const [hasMapError, setHasMapError] = useState(false);
  const { markers, route, center } = getCourseMapData(course.places);

  return (
    <div className="bg-neutral-01 flex h-dvh flex-col">
      <div className="relative flex-1 overflow-y-auto">
        {hasMapError ? (
          <CourseListFallback
            places={course.places}
            onRetry={() => setHasMapError(false)}
          />
        ) : (
          <KakaoMap
            center={center}
            markers={markers}
            route={route}
            onError={() => setHasMapError(true)}
          />
        )}
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
