import { type ReactNode } from "react";

import AppHeader from "@/components/layout/AppHeader";
import Button from "@/components/ui/Button";
import { TRAVEL_SCHEDULE_OPTIONS } from "@/features/places/utils/travelSchedule";
import type { DurationType } from "@/types/course";

interface TravelPeriodScreenProps {
  travelSchedule: DurationType;
  startDate: string;
  endDate: string;
  today: string;
  isValid: boolean;
  selectedCount: number;
  onScheduleChange: (value: DurationType) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onNext: () => void;
  onOpenMenu: () => void;
  sidebar: ReactNode;
}

/**
 * 여행 기간 선택 화면 (기능명세 2.1.0).
 * 장소 선택 화면(2.1.1~2.1.3) 진입 전, 기간·날짜를 먼저 정한다.
 */
const TravelPeriodScreen = ({
  travelSchedule,
  startDate,
  endDate,
  today,
  isValid,
  selectedCount,
  onScheduleChange,
  onStartDateChange,
  onEndDateChange,
  onNext,
  onOpenMenu,
  sidebar,
}: TravelPeriodScreenProps) => (
  <main className="bg-neutral-01 mx-auto min-h-dvh w-full max-w-[430px] pb-[max(28px,env(safe-area-inset-bottom))]">
    <AppHeader
      backHref="/onboarding/result"
      onOpenMenu={onOpenMenu}
      centerLabel="여행 기간"
    />
    <section className="px-6 pt-7">
      <p className="text-primary-08 text-[12px] font-semibold tracking-[0.12em]">
        PLAN YOUR DAYS
      </p>
      <h1 className="text-neutral-07 mt-2 text-[30px] leading-[1.25] font-bold">
        광주에 얼마나
        <br />
        머무르나요?
      </h1>
      <p className="text-neutral-04 mt-3 text-[14px] leading-[1.6]">
        기간에 맞춰 운영시간과 이동 거리를 고려한 장소를 골라드려요.
      </p>

      <fieldset className="mt-7 grid grid-cols-2 gap-3">
        <legend className="sr-only">여행 기간 선택</legend>
        {TRAVEL_SCHEDULE_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={travelSchedule === option.id}
            onClick={() => onScheduleChange(option.id)}
            className={`min-h-24 rounded-[20px] border p-4 text-left transition-colors ${
              travelSchedule === option.id
                ? "border-primary-08 bg-primary-04"
                : "border-neutral-03 bg-white"
            }`}
          >
            <span className="text-neutral-07 block text-[16px] font-semibold">
              {option.label}
            </span>
            <span className="text-neutral-04 mt-2 block text-[12px]">
              권장 {option.recommendation}
            </span>
          </button>
        ))}
      </fieldset>

      <div className="border-neutral-03 mt-7 rounded-[20px] border bg-white p-5">
        <h2 className="text-neutral-07 text-[15px] font-semibold">여행 날짜</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="text-neutral-04 text-[12px]">
            시작일
            <input
              type="date"
              min={today}
              value={startDate}
              onChange={(event) => onStartDateChange(event.target.value)}
              className="border-neutral-03 text-neutral-07 mt-1.5 min-h-12 w-full rounded-xl border bg-white px-3 text-[13px]"
            />
          </label>
          <label className="text-neutral-04 text-[12px]">
            종료일
            <input
              type="date"
              min={startDate || today}
              value={endDate}
              disabled={travelSchedule !== "CUSTOM"}
              onChange={(event) => onEndDateChange(event.target.value)}
              className="border-neutral-03 text-neutral-07 disabled:bg-neutral-02 mt-1.5 min-h-12 w-full rounded-xl border bg-white px-3 text-[13px] disabled:opacity-100"
            />
          </label>
        </div>
        {!isValid && (
          <p className="text-caution-02 mt-3 text-[12px]" role="alert">
            과거 날짜는 선택할 수 없으며, ‘그 이상’은 3박 이상이어야 해요.
          </p>
        )}
      </div>

      {selectedCount > 0 && (
        <p className="bg-primary-04 text-primary-08 mt-4 rounded-xl px-4 py-3 text-[12px]">
          기간을 바꿔도 이미 고른 {selectedCount}곳은 유지돼요. 새 최소 개수만
          다시 확인해 주세요.
        </p>
      )}
      <Button
        variant="solid"
        size="lg"
        className="mt-6 w-full"
        disabled={!isValid}
        onClick={onNext}
      >
        다음 · 장소 고르기
      </Button>
    </section>
    {sidebar}
  </main>
);

export default TravelPeriodScreen;
