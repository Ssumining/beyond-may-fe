import type { IconProps } from "./types";

/**
 * 이미지(사진) 아이콘.
 * 색은 currentColor를 따르므로 부모에서 text-* 또는 text-[color]로 제어.
 * 크기는 className의 w-* / h-* 로 지정.
 */
const Image = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 39 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M24.375 13H24.3913"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27.625 6.5H11.375C8.68261 6.5 6.5 8.68261 6.5 11.375V27.625C6.5 30.3174 8.68261 32.5 11.375 32.5H27.625C30.3174 32.5 32.5 30.3174 32.5 27.625V11.375C32.5 8.68261 30.3174 6.5 27.625 6.5Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 24.375L13 17.875C13.7411 17.1619 14.5818 16.7865 15.4375 16.7865C16.2932 16.7865 17.1339 17.1619 17.875 17.875L26 26"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.75 22.75L24.375 21.125C25.1161 20.4119 25.9568 20.0365 26.8125 20.0365C27.6682 20.0365 28.5089 20.4119 29.25 21.125L32.5 24.375"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Image;
