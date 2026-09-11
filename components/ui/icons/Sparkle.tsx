import type { IconProps } from "./types";

/**
 * 반짝임(sparkle) 아이콘. AI 관련 버튼 등에 사용.
 * 색은 currentColor를 따르므로 부모에서 text-* 로 제어.
 * 크기는 className의 w-* / h-* 로 지정.
 */
const Sparkle = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 2L14.09 9.26L21 12L14.09 14.74L12 22L9.91 14.74L3 12L9.91 9.26L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default Sparkle;
