import type { IconProps } from "./types";

/**
 * 더보기(세로 점 3개) 아이콘.
 * 색은 currentColor를 따르므로 부모에서 text-* 또는 text-[color]로 제어.
 * 크기는 className의 w-* / h-* 로 지정.
 */
const More = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 3 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M1.04167 9.37496C1.61696 9.37496 2.08333 8.90859 2.08333 8.33329C2.08333 7.758 1.61696 7.29163 1.04167 7.29163C0.46637 7.29163 0 7.758 0 8.33329C0 8.90859 0.46637 9.37496 1.04167 9.37496Z"
        fill="currentColor"
      />
      <path
        d="M1.04167 2.08333C1.61696 2.08333 2.08333 1.61696 2.08333 1.04167C2.08333 0.46637 1.61696 0 1.04167 0C0.46637 0 0 0.46637 0 1.04167C0 1.61696 0.46637 2.08333 1.04167 2.08333Z"
        fill="currentColor"
      />
      <path
        d="M1.04167 16.6666C1.61696 16.6666 2.08333 16.2003 2.08333 15.625C2.08333 15.0497 1.61696 14.5833 1.04167 14.5833C0.46637 14.5833 0 15.0497 0 15.625C0 16.2003 0.46637 16.6666 1.04167 16.6666Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default More;
