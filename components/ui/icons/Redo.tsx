import type { IconProps } from "./types";

/**
 * 다시 실행(redo/refresh) 아이콘.
 * 색은 currentColor를 따르므로 부모에서 text-* 또는 text-[color]로 제어.
 * 크기는 className의 w-* / h-* 로 지정.
 */
const Redo = ({ className }: IconProps) => {
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
        d="M20.9961 1.95648V7.70648H14.9961"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.486 12.4981C17.8359 14.2614 16.6055 15.7744 14.9801 16.8092C13.3547 17.844 11.4224 18.3445 9.47439 18.2353C7.52636 18.1261 5.66813 17.4131 4.17973 16.2037C2.69133 14.9943 1.6534 13.3541 1.22234 11.5303C0.791281 9.70641 0.990451 7.7977 1.78984 6.09175C2.58922 4.3858 3.94551 2.97505 5.65433 2.07209C7.36314 1.16912 9.3319 0.822863 11.2639 1.08549C13.196 1.34811 14.9866 2.20539 16.366 3.52814L20.996 7.70648"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Redo;
