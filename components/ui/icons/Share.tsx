import type { IconProps } from "./types";

/**
 * 공유(share) 아이콘.
 * 색은 currentColor를 따르므로 부모에서 text-* 또는 text-[color]로 제어.
 * 크기는 className의 w-* / h-* 로 지정.
 */
const Share = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 25 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M19.6921 8.20001C21.7568 8.20001 23.4306 6.58824 23.4306 4.60001C23.4306 2.61178 21.7568 1 19.6921 1C17.6274 1 15.9536 2.61178 15.9536 4.60001C15.9536 6.58824 17.6274 8.20001 19.6921 8.20001Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.73847 16.6C6.80317 16.6 8.47694 14.9882 8.47694 13C8.47694 11.0118 6.80317 9.39999 4.73847 9.39999C2.67377 9.39999 1 11.0118 1 13C1 14.9882 2.67377 16.6 4.73847 16.6Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.6921 25C21.7568 25 23.4306 23.3882 23.4306 21.4C23.4306 19.4118 21.7568 17.8 19.6921 17.8C17.6274 17.8 15.9536 19.4118 15.9536 21.4C15.9536 23.3882 17.6274 25 19.6921 25Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.96582 14.812L16.4771 19.5881"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.4646 6.41199L7.96582 11.188"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Share;
