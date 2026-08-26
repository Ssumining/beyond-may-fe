import type { IconProps } from "./types";

/**
 * 위치 비공개(핀 취소) 아이콘.
 * 색은 currentColor를 따르므로 부모에서 text-* 또는 text-[color]로 제어.
 * 크기는 className의 w-* / h-* 로 지정.
 */

const LocationOff = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 27 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M21.7202 18.72C22.6902 17 23.3502 15.12 23.3502 13.17C23.3502 10.57 22.3002 8.06998 20.4202 6.22998C18.5402 4.38998 16.0002 3.34998 13.3502 3.34998C11.4102 3.34998 9.53018 3.90998 7.93018 4.92998"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.8101 9.81001C12.9901 9.78001 13.1701 9.76001 13.3501 9.76001C15.3401 9.76001 16.9501 11.37 16.9501 13.36C16.9501 13.55 16.9201 13.73 16.9001 13.9"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3498 16.95C11.3598 16.95 9.74984 15.34 9.74984 13.35C9.74984 12.88 9.84984 12.43 10.0098 12.01L5.31984 7.32001C4.04984 9.00001 3.33984 11.04 3.33984 13.16C3.33984 20.8 13.3398 27.34 13.3398 27.34C13.3398 27.34 16.7998 25.07 19.6498 21.65L14.6798 16.68C14.2698 16.85 13.8198 16.94 13.3398 16.94L13.3498 16.95Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.3501 3.34998L24.8301 26.83"
        stroke="currentColor"
        strokeWidth={1.96}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LocationOff;
