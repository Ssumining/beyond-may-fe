import type { IconProps } from "./types";

/**
 * 카메라 비활성화(카메라 off) 아이콘.
 * 색은 currentColor를 따르므로 부모에서 text-* 또는 text-[color]로 제어.
 * 크기는 className의 w-* / h-* 로 지정.
 */

const CameraOff = ({ className }: IconProps) => {
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
        d="M1.2915 1.29166L29.7082 29.7083"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27.1248 27.125H3.87484C3.18969 27.125 2.53261 26.8528 2.04814 26.3684C1.56368 25.8839 1.2915 25.2268 1.2915 24.5417V10.3333C1.2915 9.64819 1.56368 8.99111 2.04814 8.50664C2.53261 8.02217 3.18969 7.75 3.87484 7.75H7.74984M11.6248 3.875H19.3748L21.9582 7.75H27.1248C27.81 7.75 28.4671 8.02217 28.9515 8.50664C29.436 8.99111 29.7082 9.64819 29.7082 10.3333V22.3975M19.7365 19.7367C19.3078 20.3632 18.7463 20.8875 18.0919 21.2724C17.4376 21.6573 16.7065 21.8933 15.9506 21.9635C15.1947 22.0337 14.4326 21.9365 13.7185 21.6788C13.0044 21.4211 12.3559 21.0092 11.8191 20.4724C11.2823 19.9356 10.8704 19.2871 10.6127 18.573C10.355 17.8589 10.2578 17.0968 10.328 16.3409C10.3983 15.585 10.6342 14.8539 11.0191 14.1996C11.404 13.5452 11.9283 12.9837 12.5548 12.555"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CameraOff;
