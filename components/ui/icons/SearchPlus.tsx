import type { IconProps } from "./types";

/**
 * 검색 확대(돋보기 + 플러스) 아이콘.
 * 색은 currentColor를 따르므로 부모에서 text-* 또는 text-[color]로 제어.
 * 크기는 className의 w-* / h-* 로 지정.
 */
const SearchPlus = ({ className }: IconProps) => {
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
        d="M10.3333 19.6667C15.488 19.6667 19.6667 15.488 19.6667 10.3333C19.6667 5.17868 15.488 1 10.3333 1C5.17868 1 1 5.17868 1 10.3333C1 15.488 5.17868 19.6667 10.3333 19.6667Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.9998 22L16.9248 16.925"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.3335 6.83331V13.8333"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.8335 10.3333H13.8335"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SearchPlus;
