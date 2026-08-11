import type { IconProps } from "./types";

/**
 * 외부 링크(새 창 열기) 아이콘.
 * 색은 currentColor를 따르므로 부모에서 text-* 또는 text-[color]로 제어.
 * 크기는 className의 w-* / h-* 로 지정.
 */
const ExternalLink = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M17.875 12.25V19C17.875 19.5967 17.6379 20.169 17.216 20.591C16.794 21.0129 16.2217 21.25 15.625 21.25H3.25C2.65326 21.25 2.08097 21.0129 1.65901 20.591C1.23705 20.169 1 19.5967 1 19V6.625C1 6.02826 1.23705 5.45597 1.65901 5.03401C2.08097 4.61205 2.65326 4.375 3.25 4.375H10"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 1H21.25V7.75"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.875 13.375L21.25 1"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ExternalLink;
