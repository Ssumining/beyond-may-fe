import type { IconProps } from "./types";

/**
 * 되돌리기(undo/refresh) 아이콘.
 * 색은 currentColor를 따르므로 부모에서 text-* 또는 text-[color]로 제어.
 * 크기는 className의 w-* / h-* 로 지정.
 */
const Undo = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 22 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M1 1.9494V7.6994H7"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.51 12.4911C4.15839 14.2548 5.38734 15.7687 7.01166 16.8049C8.63598 17.841 10.5677 18.3432 12.5157 18.2358C14.4637 18.1283 16.3226 17.4171 17.8121 16.2092C19.3017 15.0013 20.3413 13.3622 20.7742 11.5388C21.2072 9.71549 21.0101 7.80669 20.2126 6.10003C19.4152 4.39338 18.0605 2.98132 16.3528 2.07663C14.6451 1.17193 12.6769 0.823604 10.7447 1.08413C8.81245 1.34466 7.02091 2.19992 5.64 3.52106L1 7.69939"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Undo;
