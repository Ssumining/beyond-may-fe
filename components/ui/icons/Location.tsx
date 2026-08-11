import type { IconProps } from "./types";

/**
 * 위치(핀) 아이콘.
 * 색은 currentColor를 따르므로 부모에서 text-* 또는 text-[color]로 제어.
 * 크기는 className의 w-* / h-* 로 지정.
 */

const Location = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 22 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M21 10.8182C21 18.4545 11 25 11 25C11 25 1 18.4545 1 10.8182C1 8.21424 2.05357 5.71695 3.92893 3.87568C5.8043 2.03441 8.34784 1 11 1C13.6522 1 16.1957 2.03441 18.0711 3.87568C19.9464 5.71695 21 8.21424 21 10.8182Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.9999 14.6C12.9881 14.6 14.5999 12.9882 14.5999 11C14.5999 9.0118 12.9881 7.40002 10.9999 7.40002C9.01168 7.40002 7.3999 9.0118 7.3999 11C7.3999 12.9882 9.01168 14.6 10.9999 14.6Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Location;
