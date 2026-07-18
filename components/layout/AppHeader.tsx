import Link from "next/link";

import { cn } from "@/lib/cn";
import Home from "@/components/ui/icons/Home";
import Hamburger from "@/components/ui/icons/Hamburger";

interface AppHeaderProps {
  /**
   * 햄버거 클릭 시 호출. 사이드바 열기 담당.
   * TODO: 사이드바(설정/위치 이동 등) 내용 확정 후 연결. 미지정 시 버튼은 비활성처럼 동작.
   */
  onOpenMenu?: () => void;
  /**
   * 우측 햄버거(메뉴) 노출 여부. 기본 true.
   * 결과 로딩처럼 Home만 필요한 화면에서는 false로 넘겨 Home만 표시.
   */
  showMenu?: boolean;
  className?: string;
}

/**
 * 각 페이지 상단 공용 헤더 (기능명세 메인 등).
 * 전역 layout에 두지 않고, 헤더가 필요한 페이지가 직접 삽입한다.
 *
 * - 좌측 Home: 루트('/')로 이동
 * - 우측 Hamburger: 사이드바 토글 (내용 미정), showMenu=false면 숨김
 *
 * 색은 currentColor 기반이라 부모에서 text-* 로 제어한다.
 * 기본 아이콘 색은 neutral-03(메인 그라디언트 배경 기준)이며,
 * 밝은 배경 화면에서는 className으로 text-* 를 넘겨 덮어쓴다.
 */
const AppHeader = ({
  onOpenMenu,
  showMenu = true,
  className,
}: AppHeaderProps) => {
  return (
    <header
      className={cn(
        "text-neutral-03 flex items-center justify-between px-5 pt-4",
        className,
      )}
    >
      <Link
        href="/"
        aria-label="홈으로 이동"
        className="focus-visible:outline-neutral-07 rounded-lg p-2 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <Home className="h-6 w-6" />
      </Link>

      {showMenu && (
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="메뉴 열기"
          className="focus-visible:outline-neutral-07 rounded-lg p-2 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Hamburger className="h-6 w-6" />
        </button>
      )}
    </header>
  );
};

export default AppHeader;
