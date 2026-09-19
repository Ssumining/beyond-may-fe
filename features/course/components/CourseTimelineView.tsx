"use client";

import { useState } from "react";

import AppHeader from "@/components/layout/AppHeader";
import CourseTimeline from "@/features/course/components/CourseTimeline";
import Sparkle from "@/components/ui/icons/Sparkle";
import type {
  CourseResponse,
  CoursePlace,
  TravelSchedule,
} from "@/types/course";

const TRAVEL_SCHEDULE_LABELS: Record<TravelSchedule, string> = {
  DAY_TRIP: "당일치기",
  ONE_NIGHT_TWO_DAYS: "1박 2일",
};

interface CourseTimelineViewProps {
  course: CourseResponse;
  addedPlaceIds?: number[];
  onBack?: () => void;
  onOpenMenu?: () => void;
  onUseCourse?: () => void;
  isUsingCourse?: boolean;
  hasUseCourseError?: boolean;
  onEditWithAi?: () => void;
  onEditManually?: () => void;
}

const CourseTimelineView = ({
  course,
  addedPlaceIds,
  onBack,
  onOpenMenu,
  onUseCourse,
  isUsingCourse = false,
  hasUseCourseError = false,
  onEditWithAi,
  onEditManually,
}: CourseTimelineViewProps) => {
  const { title, travelSchedule, places } = course;
  const sortedPlaces = [...places].sort(
    (a, b) => a.dayNumber - b.dayNumber || a.visitOrder - b.visitOrder,
  );
  const firstPlaceName = sortedPlaces[0]?.name ?? "";
  const [activePlaceId, setActivePlaceId] = useState<number | undefined>(
    sortedPlaces[0]?.placeId,
  );

  const meta = `${places.length}곳 · ${TRAVEL_SCHEDULE_LABELS[travelSchedule]}${
    firstPlaceName ? ` · ${firstPlaceName}부터` : ""
  }`;

  const handlePlaceClick = (place: CoursePlace) => {
    setActivePlaceId(place.placeId);
  };

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col bg-[#FDFFFA]">
      <AppHeader
        onBack={onBack}
        showMenu={true}
        onOpenMenu={onOpenMenu}
        centerLabel={title}
      />

      <div className="flex-1 overflow-y-auto pt-[18px]">
        <CourseTimeline
          places={places}
          activePlaceId={activePlaceId}
          addedPlaceIds={addedPlaceIds}
          onPlaceClick={handlePlaceClick}
        />
      </div>

      {/* 3.1.2 하단 패널: 단일 메인 버튼 + 하단 텍스트 버튼 2개 */}
      <div className="border-t border-[#DEDEDE] bg-[#FDFFFA] px-[25px] pt-[26px] pb-[max(20px,env(safe-area-inset-bottom))]">
        <p className="font-['JetBrains_Mono'] text-[10px] font-normal tracking-[1px] text-[#77797F] uppercase">
          추천 코스
        </p>
        <h1 className="mt-[7px] text-[19.2px] leading-[24px] font-semibold text-[#141414]">
          {title}
        </h1>
        <p className="mt-[5px] text-[11.6px] leading-[14px] text-[#BFC3C1]">
          {meta}
        </p>

        {onUseCourse && (
          <button
            type="button"
            onClick={onUseCourse}
            disabled={isUsingCourse}
            className="mt-[29px] flex h-[50px] w-full items-center justify-center rounded-[29px] bg-[#141414] font-['Gothic_A1'] text-[14px] font-[800] tracking-[1px] text-[#FDFFFA] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
          >
            {isUsingCourse ? "코스 확정 중" : "이 코스 사용"}
          </button>
        )}

        {hasUseCourseError && (
          <p
            className="text-caution-02 mt-3 text-center text-[12px]"
            role="alert"
          >
            코스를 확정하지 못했어요. 다시 시도해 주세요.
          </p>
        )}

        {(onEditWithAi || onEditManually) && (
          <div className="mt-[15px] flex items-center justify-center gap-[22px]">
            {onEditWithAi && (
              <button
                type="button"
                onClick={onEditWithAi}
                className="focus-visible:outline-primary-03 flex items-center gap-[4px] rounded-full font-['Manrope'] text-[13.4px] font-semibold text-[#141414]"
              >
                <Sparkle className="h-[13px] w-[13px] text-[#141414]" />
                AI로 다듬기
              </button>
            )}
            {onEditManually && (
              <button
                type="button"
                onClick={onEditManually}
                className="focus-visible:outline-primary-03 rounded-full font-['Manrope'] text-[13.4px] font-semibold text-[#77797F]"
              >
                직접 수정
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default CourseTimelineView;
