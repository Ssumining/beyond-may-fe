import type { IconProps } from "./types";

/**
 * 달력 아이콘.
 * 색은 currentColor를 따르므로 부모에서 text-* 또는 text-[color]로 제어.
 * 크기는 className의 w-* / h-* 로 지정.
 */

const Calendar = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="2.5"
        y="3.75"
        width="15"
        height="13.75"
        rx="2"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <path
        d="M2.5 7.917h15"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <path
        d="M6.25 2.5v2.5M13.75 2.5v2.5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Calendar;
