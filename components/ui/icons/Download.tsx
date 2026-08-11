import type { IconProps } from "./types";

/**
 * 다운로드 아이콘.
 * 색은 currentColor를 따르므로 부모에서 text-* 또는 text-[color]로 제어.
 * 크기는 className의 w-* / h-* 로 지정.
 */
const Download = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 22 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M20.5 13.5V17.6667C20.5 18.2192 20.2717 18.7491 19.8654 19.1398C19.4591 19.5305 18.908 19.75 18.3333 19.75H3.16667C2.59203 19.75 2.04093 19.5305 1.6346 19.1398C1.22827 18.7491 1 18.2192 1 17.6667V13.5"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.3335 8.29169L10.7502 13.5L16.1668 8.29169"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.75 13.5V1"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Download;
