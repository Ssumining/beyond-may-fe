interface HamburgerProps {
  className?: string;
}

/**
 * 햄버거(메뉴) 아이콘. 색은 currentColor를 따르므로 부모에서 text-* 로 제어.
 * 크기는 className의 w-* / h-* 로 지정.
 */

const Hamburger = ({ className }: HamburgerProps) => {
  return (
    <svg
      viewBox="0 0 24 21"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path d="M0 0H24V2.625H0V0ZM0 9.1875H24V11.8125H0V9.1875ZM0 18.375H24V21H0V18.375Z" />
    </svg>
  );
};

export default Hamburger;
