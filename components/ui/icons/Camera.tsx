import type { IconProps } from "./types";

/**
 * 카메라 아이콘.
 * 색은 currentColor를 따르므로 부모에서 text-* 또는 text-[color]로 제어.
 * 크기는 className의 w-* / h-* 로 지정.
 */
const Camera = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 31 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M29.7082 24.5417C29.7082 25.2268 29.436 25.8839 28.9515 26.3684C28.4671 26.8528 27.81 27.125 27.1248 27.125H3.87484C3.18969 27.125 2.53261 26.8528 2.04814 26.3684C1.56368 25.8839 1.2915 25.2268 1.2915 24.5417V10.3333C1.2915 9.64819 1.56368 8.99111 2.04814 8.50664C2.53261 8.02217 3.18969 7.75 3.87484 7.75H9.0415L11.6248 3.875H19.3748L21.9582 7.75H27.1248C27.81 7.75 28.4671 8.02217 28.9515 8.50664C29.436 8.99111 29.7082 9.64819 29.7082 10.3333V24.5417Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5002 21.9583C18.3536 21.9583 20.6668 19.6451 20.6668 16.7917C20.6668 13.9382 18.3536 11.625 15.5002 11.625C12.6467 11.625 10.3335 13.9382 10.3335 16.7917C10.3335 19.6451 12.6467 21.9583 15.5002 21.9583Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Camera;
