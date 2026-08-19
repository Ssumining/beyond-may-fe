import type { CourseDetailResponse, DurationType } from "@/types/course";

/** 여행 기간 enum → 한글 표기 */
const DURATION_LABELS: Record<DurationType, string> = {
  DAY_TRIP: "당일치기",
  ONE_NIGHT: "1박 2일",
  TWO_NIGHTS: "2박 3일",
};

interface CourseSummaryPanelProps {
  course: CourseDetailResponse;
  onDetailClick?: () => void;
  onConfirmClick?: () => void;
}

/**
 * 추천 코스 지도 하단 요약 패널.
 * 코스명·메타 정보와 액션 버튼 2종(코스 상세 / 이 코스로 진행)을 표시한다.
 * 버튼 동작 연결은 후속 이슈에서 처리한다.
 */
const CourseSummaryPanel = ({
  course,
  onDetailClick,
  onConfirmClick,
}: CourseSummaryPanelProps) => {
  const { title, durationType, summary, places } = course;
  const firstPlaceName = places[0]?.name ?? "";
  const meta = `${summary.totalPlaceCount}곳 · ${DURATION_LABELS[durationType]}${
    firstPlaceName ? ` · ${firstPlaceName}부터` : ""
  }`;

  return (
    <div className="border-neutral-03 bg-neutral-01 border-t px-6 pt-5 pb-6">
      <p className="text-neutral-04 text-[10px] tracking-[1px] uppercase">
        추천 코스
      </p>
      <h2 className="text-neutral-07 mt-2 text-[19.2px] leading-6 font-semibold">
        {title}
      </h2>
      <p className="text-neutral-05 mt-1 text-[11.6px] leading-[14px]">
        {meta}
      </p>

      <div className="mt-4 flex gap-4">
        <button
          type="button"
          onClick={onDetailClick}
          className="border-neutral-07 text-neutral-07 bg-neutral-01 h-[50px] flex-1 rounded-[29px] border text-sm font-extrabold tracking-[1px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
        >
          코스 상세
        </button>
        <button
          type="button"
          onClick={onConfirmClick}
          className="bg-neutral-07 text-neutral-01 h-[50px] flex-1 rounded-[29px] text-sm font-extrabold tracking-[1px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
        >
          이 코스로 진행
        </button>
      </div>
    </div>
  );
};

export default CourseSummaryPanel;
