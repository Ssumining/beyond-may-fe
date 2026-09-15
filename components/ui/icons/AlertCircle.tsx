import type { IconProps } from "./types";

/**
 * 경고/오류 아이콘 (원 + 느낌표).
 * 색은 currentColor를 따르므로 부모에서 text-* 로 제어.
 * 크기는 className의 w-* / h-* 로 지정.
 */
const AlertCircle = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={1.6} />
      <path
        d="M12 7V13"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <circle cx={12} cy={16.5} r={1} fill="currentColor" />
    </svg>
  );
};

export default AlertCircle;
