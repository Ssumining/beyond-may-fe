import type { IconProps } from "./types";

/**
 * 사용자(프로필) 아이콘.
 * 색은 currentColor를 따르므로 부모에서 text-* 또는 text-[color]로 제어.
 * 크기는 className의 w-* / h-* 로 지정.
 */
const User = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 20 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M19 20.4062V18.25C19 17.1063 18.5259 16.0094 17.682 15.2006C16.8381 14.3919 15.6935 13.9375 14.5 13.9375H5.5C4.30653 13.9375 3.16193 14.3919 2.31802 15.2006C1.47411 16.0094 1 17.1063 1 18.25V20.4062"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 9.625C12.4853 9.625 14.5 7.69423 14.5 5.3125C14.5 2.93077 12.4853 1 10 1C7.51472 1 5.5 2.93077 5.5 5.3125C5.5 7.69423 7.51472 9.625 10 9.625Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default User;
