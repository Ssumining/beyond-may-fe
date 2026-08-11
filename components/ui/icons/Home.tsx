import type { IconProps } from "./types";

/**
 * 홈(집) 아이콘.
 * 색은 currentColor를 따르므로 부모에서 text-* 또는 text-[color]로 제어.
 * 크기는 className의 w-* / h-* 로 지정.
 */
const Home = ({ className }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M1 9.55556L12 1L23 9.55556V23C23 23.6483 22.7425 24.2701 22.284 24.7285C21.8256 25.1869 21.2039 25.4444 20.5556 25.4444H3.44444C2.79614 25.4444 2.17438 25.1869 1.71596 24.7285C1.25754 24.2701 1 23.6483 1 23V9.55556Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.3335 25.4445V13.2222H15.6668V25.4445"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Home;
