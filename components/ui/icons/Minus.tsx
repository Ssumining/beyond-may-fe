import type { IconProps } from "./types";

/**
 * 제거(마이너스) 아이콘.
 * 색은 currentColor를 따르므로 부모에서 text-* 또는 text-[color]로 제어.
 * 크기는 className의 w-* / h-* 로 지정.
 */
const Minus = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M8.3335 20H31.6668"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Minus;
