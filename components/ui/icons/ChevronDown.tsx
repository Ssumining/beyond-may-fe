import type { IconProps } from "./types";

/**
 * 아래를 가리키는 삼각형(▼) 아이콘. 스크롤 힌트에 사용.
 * 색은 currentColor를 따르므로 부모에서 text-* 로 제어.
 * 크기는 className의 w-* / h-* 로 지정.
 * 위쪽(▲)이 필요하면 사용하는 쪽에서 rotate-180 을 적용.
 */

const ChevronDown = ({ className }: IconProps) => {
  return (
    <svg
      viewBox="0 0 15 9"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path d="M7.36133 8.25L0.000111347 5.20717e-07L14.7225 1.80779e-06L7.36133 8.25Z" />
    </svg>
  );
};

export default ChevronDown;
