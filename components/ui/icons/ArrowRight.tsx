import type { IconProps } from "./types";

/**
 * 오른쪽 화살표 아이콘.
 * 색은 currentColor를 따르므로 부모에서 text-* 또는 text-[color]로 제어.
 * 크기는 className의 w-* / h-* 로 지정.
 */
const ArrowRight = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M1 10.3333H19.6667"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.3335 1L19.6668 10.3333L10.3335 19.6667"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowRight;
