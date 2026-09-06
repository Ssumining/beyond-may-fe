"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/cn";
import Button from "@/components/ui/Button";
import ChevronLeft from "@/components/ui/icons/ChevronLeft";
import ChevronRight from "@/components/ui/icons/ChevronRight";
import Hamburger from "@/components/ui/icons/Hamburger";

/**
 * 여행 기간 옵션. course 도메인의 DurationType(DAY_TRIP/ONE_NIGHT/TWO_NIGHTS)과
 * 값은 맞췄지만, "그 이상"(CUSTOM)이 거기 없어 지금은 별도 로컬 타입으로 둔다.
 * TODO: course 담당자와 협의 후 types/course.ts의 DurationType과 합칠지 결정. (B)
 */
export type TripDurationOption =
  | "DAY_TRIP"
  | "ONE_NIGHT"
  | "TWO_NIGHTS"
  | "CUSTOM";

export interface TripDurationRange {
  option: TripDurationOption;
  minCount: number;
  /** CUSTOM(그 이상)은 상한이 없어 null */
  maxCount: number | null;
  travelDate: string;
}

interface DurationChoice {
  option: TripDurationOption;
  label: string;
  countLabel: string;
  minCount: number;
  maxCount: number | null;
}

// TODO(백엔드/기획 확인): 기간별 개수 범위, "그 이상" 처리 방식 확정 필요
const DURATION_CHOICES: DurationChoice[] = [
  {
    option: "DAY_TRIP",
    label: "당일 치기",
    countLabel: "4~6곳",
    minCount: 4,
    maxCount: 6,
  },
  {
    option: "ONE_NIGHT",
    label: "1박 2일",
    countLabel: "5~7곳",
    minCount: 5,
    maxCount: 7,
  },
  {
    option: "TWO_NIGHTS",
    label: "2박 3일",
    countLabel: "7~10곳",
    minCount: 7,
    maxCount: 10,
  },
  {
    option: "CUSTOM",
    label: "그 이상",
    countLabel: "직접 선택",
    minCount: 1,
    maxCount: null,
  },
];

interface TripDurationSelectProps {
  onOpenMenu: () => void;
  onConfirm: (range: TripDurationRange) => void;
}

/**
 * 여행 기간 선택 화면. 카드덱(2.1.1) 진입 전 첫 단계로,
 * 여기서 고른 기간에 따라 이후 선택 목록 패널(2.2.1)의 최소·최대 개수가 정해진다.
 */
const TripDurationSelect = ({
  onOpenMenu,
  onConfirm,
}: TripDurationSelectProps) => {
  const router = useRouter();
  const [selected, setSelected] = useState<TripDurationOption | null>(null);
  const [travelDate, setTravelDate] = useState("");

  const selectedChoice = DURATION_CHOICES.find((c) => c.option === selected);

  const handleConfirm = () => {
    if (!selectedChoice) return;
    onConfirm({
      option: selectedChoice.option,
      minCount: selectedChoice.minCount,
      maxCount: selectedChoice.maxCount,
      travelDate,
    });
  };

  return (
    <div className="flex flex-1 flex-col">
      <header className="text-neutral-04 flex items-center justify-between px-5 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="뒤로 가기"
          className="focus-visible:outline-neutral-07 cursor-pointer rounded-lg p-2 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="메뉴 열기"
          className="focus-visible:outline-neutral-07 cursor-pointer rounded-lg p-2 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Hamburger className="h-6 w-6" />
        </button>
      </header>

      <div className="flex flex-1 flex-col px-6 pt-10">
        <h1 className="text-neutral-07 text-[24px] leading-snug font-bold">
          여행은
          <br />
          며칠 동안 하시나요?
        </h1>

        <div className="mt-8 flex flex-col gap-3">
          {DURATION_CHOICES.map((choice) => {
            const isSelected = choice.option === selected;
            const isCustom = choice.option === "CUSTOM";

            return (
              <button
                key={choice.option}
                type="button"
                onClick={() => setSelected(choice.option)}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-5 py-4 text-[15px] transition-colors",
                  isSelected
                    ? "bg-neutral-07 border-neutral-07 text-neutral-01"
                    : isCustom
                      ? "border-neutral-05 text-neutral-05"
                      : "border-neutral-04 text-neutral-07",
                )}
              >
                <span>{choice.label}</span>
                <span
                  className={cn(
                    "flex items-center gap-1 text-[13px]",
                    isSelected ? "text-neutral-01" : "text-neutral-04",
                  )}
                >
                  {choice.countLabel}
                  {isCustom && <ChevronRight className="h-3 w-3" />}
                </span>
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="mt-6">
            <label
              htmlFor="travel-date"
              className="text-neutral-04 text-[13px]"
            >
              출발일
            </label>
            <input
              id="travel-date"
              type="date"
              value={travelDate}
              onChange={(event) => setTravelDate(event.target.value)}
              className="border-neutral-04 text-neutral-07 mt-1.5 w-full rounded-lg border px-3.5 py-3 text-[15px] outline-none"
            />
          </div>
        )}
      </div>

      <div className="px-6 pb-10">
        <Button
          variant="solid"
          size="lg"
          disabled={!selectedChoice}
          onClick={handleConfirm}
          className="w-full"
        >
          선택하기
        </Button>
      </div>
    </div>
  );
};

export default TripDurationSelect;
