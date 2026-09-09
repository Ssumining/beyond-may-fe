"use client";

import { useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";

import { cn } from "@/lib/cn";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import ChevronLeft from "@/components/ui/icons/ChevronLeft";
import ChevronRight from "@/components/ui/icons/ChevronRight";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
/** YYYY-MM-DD — 네이티브 input[type=date]와 동일한 포맷으로 값을 주고받는다 */
const DATE_FORMAT = "yyyy-MM-dd";

interface DatePickerModalBaseProps {
  open: boolean;
  onClose: () => void;
  /** 이 날짜 이전은 선택할 수 없다 (YYYY-MM-DD) */
  min?: string;
}

interface SingleDatePickerModalProps extends DatePickerModalBaseProps {
  mode: "single";
  /** YYYY-MM-DD */
  value: string;
  onConfirm: (value: string) => void;
}

interface RangeDatePickerModalProps extends DatePickerModalBaseProps {
  mode: "range";
  /** YYYY-MM-DD */
  startDate: string;
  /** YYYY-MM-DD */
  endDate: string;
  onConfirm: (range: { startDate: string; endDate: string }) => void;
  /** 시작일 포함 최대 며칠까지 선택 가능한지 (N박 M일의 M). 없으면 제한 없음 */
  maxRangeDays?: number;
}

type DatePickerModalProps =
  | SingleDatePickerModalProps
  | RangeDatePickerModalProps;

const toDateOrNull = (value: string): Date | null => {
  if (!value) return null;
  const parsed = parseISO(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * 날짜 선택 캘린더 모달 (기능명세: 여행 날짜 선택).
 * 단일 날짜(single)와 기간(range) 두 모드를 지원하며, 값은 네이티브
 * input[type=date]와 같은 YYYY-MM-DD 문자열로 주고받는다.
 * "선택"을 눌러야 확정되고, 그 전까지는 캘린더 안에서만 임시 상태로 남는다.
 */
const DatePickerModal = (props: DatePickerModalProps) => {
  const { open, onClose, min } = props;
  const minDate = useMemo(
    () => (min ? startOfDay(parseISO(min)) : null),
    [min],
  );

  const initialViewMonth =
    props.mode === "single"
      ? (toDateOrNull(props.value) ?? new Date())
      : (toDateOrNull(props.startDate) ?? new Date());

  const [viewMonth, setViewMonth] = useState(initialViewMonth);
  const [pendingValue, setPendingValue] = useState<Date | null>(
    props.mode === "single" ? toDateOrNull(props.value) : null,
  );
  const [pendingStart, setPendingStart] = useState<Date | null>(
    props.mode === "range" ? toDateOrNull(props.startDate) : null,
  );
  const [pendingEnd, setPendingEnd] = useState<Date | null>(
    props.mode === "range" ? toDateOrNull(props.endDate) : null,
  );

  // 모달을 다시 열 때마다(닫힘→열림 전환) 그 시점의 props 값으로 임시 상태를 초기화한다.
  // (useEffect 대신 렌더링 중 이전 값과 비교하는 패턴 — cascading render 방지)
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      if (props.mode === "single") {
        const value = toDateOrNull(props.value);
        setPendingValue(value);
        setViewMonth(value ?? new Date());
      } else {
        const start = toDateOrNull(props.startDate);
        const end = toDateOrNull(props.endDate);
        setPendingStart(start);
        setPendingEnd(end);
        setViewMonth(start ?? new Date());
      }
    }
  }

  const days = useMemo(() => {
    const gridStart = startOfWeek(startOfMonth(viewMonth));
    const gridEnd = endOfWeek(endOfMonth(viewMonth));
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [viewMonth]);

  // 종료일을 고르는 동안(시작만 있고 끝은 아직 없을 때)만 상한을 적용한다 —
  // 이미 완성된 기간을 다시 찍기 시작하면(새 시작일) 상한도 그 시작일 기준으로 다시 계산된다.
  const maxEndDate =
    props.mode === "range" && props.maxRangeDays && pendingStart && !pendingEnd
      ? addDays(pendingStart, props.maxRangeDays - 1)
      : null;

  const isDisabled = (day: Date) =>
    (!!minDate && isBefore(day, minDate)) ||
    (!!maxEndDate && isAfter(day, maxEndDate));

  const handleSelectDay = (day: Date) => {
    if (isDisabled(day)) return;

    if (props.mode === "single") {
      setPendingValue(day);
      return;
    }

    if (!pendingStart || (pendingStart && pendingEnd)) {
      setPendingStart(day);
      setPendingEnd(null);
      return;
    }
    // 시작일과 같은 날짜를 종료일로 다시 찍는 건 0박이라 의미가 없고,
    // 모양도 원 뒤로 배경 사각형이 삐져나와 보이는 문제가 있어 막는다.
    if (isSameDay(day, pendingStart)) return;
    if (isBefore(day, pendingStart)) {
      setPendingStart(day);
      return;
    }
    setPendingEnd(day);
  };

  const handleConfirm = () => {
    if (props.mode === "single") {
      if (!pendingValue) return;
      props.onConfirm(format(pendingValue, DATE_FORMAT));
      return;
    }
    if (!pendingStart || !pendingEnd) return;
    props.onConfirm({
      startDate: format(pendingStart, DATE_FORMAT),
      endDate: format(pendingEnd, DATE_FORMAT),
    });
  };

  const canConfirm =
    props.mode === "single" ? !!pendingValue : !!pendingStart && !!pendingEnd;

  return (
    <Modal open={open} onClose={onClose} className="max-w-85.5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewMonth((prev) => subMonths(prev, 1))}
          aria-label="이전 달"
          className="text-neutral-06 focus-visible:outline-primary-03 flex h-9 w-9 items-center justify-center rounded-full focus-visible:outline-2"
        >
          <ChevronLeft className="h-3 w-3" />
        </button>
        <p className="text-neutral-07 text-[16px] font-semibold">
          {format(viewMonth, "yyyy년 M월")}
        </p>
        <button
          type="button"
          onClick={() => setViewMonth((prev) => addMonths(prev, 1))}
          aria-label="다음 달"
          className="text-neutral-06 focus-visible:outline-primary-03 flex h-9 w-9 items-center justify-center rounded-full focus-visible:outline-2"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      <div className="text-neutral-04 mt-4 grid grid-cols-7 text-center text-[12px] font-medium">
        {WEEKDAY_LABELS.map((label, index) => (
          <span
            key={label}
            className={cn(
              index === 0 && "text-red-500",
              index === 6 && "text-blue-500",
            )}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7">
        {days.map((day) => {
          const inCurrentMonth = isSameMonth(day, viewMonth);
          const disabled = isDisabled(day);
          const today = isToday(day);
          const dayOfWeek = getDay(day);

          const isSelectedSingle =
            props.mode === "single" &&
            !!pendingValue &&
            isSameDay(day, pendingValue);
          const isRangeStart =
            props.mode === "range" &&
            !!pendingStart &&
            isSameDay(day, pendingStart);
          const isRangeEnd =
            props.mode === "range" &&
            !!pendingEnd &&
            isSameDay(day, pendingEnd);
          const isInRange =
            props.mode === "range" &&
            !!pendingStart &&
            !!pendingEnd &&
            isAfter(day, pendingStart) &&
            isBefore(day, pendingEnd);
          // 선택된 기간 안에 든 토/일은 다른 선택된 날짜와 똑같이 검게 보여준다.
          const isPlainWeekendText =
            inCurrentMonth &&
            !disabled &&
            !isInRange &&
            (dayOfWeek === 0 || dayOfWeek === 6);
          const isRangeEdge = isRangeStart || isRangeEnd;
          // 시작=끝(연박 없이 하루만 찍힌 경우)이거나, 끝을 아직 안 고른 상태(시작만
          // 있음)면 연결할 상대가 없으니 그냥 동그라미 하나로 보여준다.
          const isSingleDayRange = isRangeStart && isRangeEnd;
          const isLoneStart = isRangeStart && !pendingEnd;
          const isStandaloneRangeDay = isSingleDayRange || isLoneStart;
          const hasRange =
            props.mode === "range" && !!pendingStart && !!pendingEnd;

          return (
            <div
              key={day.toISOString()}
              className={cn(
                // 배경과 안쪽 캡이 항상 같은 모양이어야 겹침/틈 없이 하나로 붙어
                // 보인다. 시작은 왼쪽만, 끝은 오른쪽만 둥글게 — 가운데로 향하는
                // 면은 둘 다 사각형이라 서로 맞닿는다.
                hasRange &&
                  !isStandaloneRangeDay &&
                  (isInRange || isRangeStart || isRangeEnd) &&
                  "bg-primary-04",
                isRangeStart && !isStandaloneRangeDay && "rounded-l-full",
                isRangeEnd && !isStandaloneRangeDay && "rounded-r-full",
              )}
            >
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleSelectDay(day)}
                aria-pressed={isSelectedSingle || isRangeEdge}
                aria-label={format(day, "yyyy년 M월 d일")}
                className={cn(
                  "relative flex h-10 w-full items-center justify-center text-[14px]",
                  !inCurrentMonth && "text-neutral-05",
                  inCurrentMonth && !disabled && "text-neutral-07",
                  disabled && "text-neutral-03",
                  // 토요일은 파란색, 일요일은 빨간색 (선택/강조 상태면 아래에서 덮어씀)
                  isPlainWeekendText && dayOfWeek === 0 && "text-red-500",
                  isPlainWeekendText && dayOfWeek === 6 && "text-blue-500",
                  (isSelectedSingle || isRangeEdge) &&
                    "bg-primary-08 text-neutral-01 font-semibold",
                  // 단일 선택이거나, 연결할 반대쪽 끝이 없으면(연박이 하루뿐이거나
                  // 시작만 찍힌 상태) 완전한 원. 그 외 연박의 시작/끝은 배경과
                  // 똑같이 한쪽만 둥글게 해 막대와 맞닿게 한다.
                  (isSelectedSingle || isStandaloneRangeDay) && "rounded-full",
                  isRangeStart && !isStandaloneRangeDay && "rounded-l-full",
                  isRangeEnd && !isStandaloneRangeDay && "rounded-r-full",
                )}
              >
                {format(day, "d")}
                {today && !isSelectedSingle && !isRangeEdge && (
                  <span
                    aria-hidden="true"
                    className="bg-primary-08 absolute bottom-1.5 h-1 w-1 rounded-full"
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="border-neutral-03 mt-5 flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-2">
          {props.mode === "range" && pendingStart && pendingEnd && (
            <>
              <p className="text-neutral-04 text-[13px] font-medium">
                {differenceInCalendarDays(pendingEnd, pendingStart)}박{" "}
                {differenceInCalendarDays(pendingEnd, pendingStart) + 1}일
              </p>
              <span className="bg-neutral-03 h-3 w-px" aria-hidden="true" />
            </>
          )}
          <button
            type="button"
            onClick={() => {
              const now = new Date();
              setViewMonth(now);
              // 단일 모드는 이동만 하면 이미 이번 달일 때 아무 반응이 없어 보이니,
              // 오늘 날짜 자체를 바로 선택해 눌렀을 때 항상 눈에 띄는 변화를 준다.
              if (props.mode === "single" && !isDisabled(now)) {
                setPendingValue(now);
              }
            }}
            className="text-neutral-06 focus-visible:outline-primary-03 cursor-pointer text-[13px] font-semibold underline underline-offset-2"
          >
            오늘
          </button>
        </div>
        <div className="flex gap-2">
          <Button onClick={onClose} className="rounded-xl">
            취소
          </Button>
          <Button
            variant="solid"
            disabled={!canConfirm}
            onClick={handleConfirm}
            className="rounded-xl"
          >
            선택
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DatePickerModal;
