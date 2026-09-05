"use client";

import { useState } from "react";

import AppHeader from "@/components/layout/AppHeader";
import CourseTimeline from "@/features/course/components/CourseTimeline";
import type {
  CourseResponse,
  CoursePlace,
  TravelSchedule,
} from "@/types/course";

/** 여행 기간 enum → 한글 표기. collection 확인값만.
 *  TODO(백엔드): 2박3일·그이상 코드 확정 시 추가 */
const TRAVEL_SCHEDULE_LABELS: Record<TravelSchedule, string> = {
  DAY_TRIP: "당일치기",
  ONE_NIGHT_TWO_DAYS: "1박 2일",
};

interface CourseTimelineViewProps {
  course: CourseResponse;
  onUseCourse?: () => void;
  onEditWithAi?: () => void;
  onEditManually?: () => void;
}

/**
 * 코스 타임라인 화면 (기능명세 3.1.2).
 * "코스 상세" 진입 시 장소를 순서 목록으로 보여주고,
 * 하단에 코스 요약과 액션(이 코스 사용 / AI로 다듬기 / 직접 수정)을 제공한다.
 */
const CourseTimelineView = ({
  course,
  onUseCourse,
  onEditWithAi,
  onEditManually,
}: CourseTimelineViewProps) => {
  const { title, travelSchedule, places } = course;
  const sortedPlaces = [...places].sort((a, b) => a.visitOrder - b.visitOrder);
  const firstPlaceName = sortedPlaces[0]?.name ?? "";
  const [activePlaceId, setActivePlaceId] = useState<number | undefined>(
    sortedPlaces[0]?.placeId,
  );

  const meta = `${places.length}곳 · ${TRAVEL_SCHEDULE_LABELS[travelSchedule]}${
    firstPlaceName ? ` · ${firstPlaceName}부터` : ""
  }`;

  const handlePlaceClick = (place: CoursePlace) => {
    setActivePlaceId(place.placeId);
    // TODO: 지도 연동 화면에서는 여기서 panTo({lat:place.latitude,lng:place.longitude}) 트리거
  };

  return (
    <div className="bg-screen-gradient flex h-dvh flex-col">
      <AppHeader className="text-neutral-07" />

      <div className="min-h-0 flex-1 px-4 pt-4 pb-2">
        <div className="bg-neutral-01 shadow-soft rounded-card h-full overflow-y-auto py-2">
          <CourseTimeline
            places={places}
            activePlaceId={activePlaceId}
            onPlaceClick={handlePlaceClick}
          />
        </div>
      </div>

      <div className="border-neutral-03 bg-neutral-01 border-t px-6 pt-5 pb-6">
        <p className="text-neutral-04 text-xs tracking-[1px] uppercase">
          추천 코스
        </p>
        <h2 className="text-neutral-07 mt-2 text-xl leading-6 font-semibold">
          {title}
        </h2>
        <p className="text-neutral-05 mt-1 text-xs">{meta}</p>

        <button
          type="button"
          onClick={onUseCourse}
          className="bg-neutral-07 text-neutral-01 shadow-soft mt-4 flex h-12.5 w-full items-center justify-center rounded-full text-sm font-extrabold tracking-[1px]"
        >
          이 코스 사용
        </button>

        <div className="mt-3 flex items-center justify-center gap-6 text-sm font-semibold">
          <button
            type="button"
            onClick={onEditWithAi}
            className="text-neutral-07 flex items-center gap-1"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            AI로 다듬기
          </button>
          <button
            type="button"
            onClick={onEditManually}
            className="text-neutral-04"
          >
            직접 수정
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseTimelineView;
