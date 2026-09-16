"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";

interface SidebarNewUserProps {
  /** "이미 계정 있으신가요?" 클릭 시 로그인 폼으로 전환 */
  onLoginClick: () => void;
}

/**
 * 비로그인 + 가입/로그인 이력 없는 신규 사용자용 사이드바 콘텐츠.
 * 성향 검사 시작을 주 동선으로, 로그인은 보조 동선으로 안내.
 */
const SidebarNewUser = ({ onLoginClick }: SidebarNewUserProps) => {
  const router = useRouter();

  return (
    <div>
      <p className="text-primary-08 text-[12px] font-semibold tracking-[0.08em]">
        START
      </p>
      <h2 className="text-neutral-07 mt-2 text-[22px] leading-[1.4] font-bold">
        나에게 맞는
        <br />
        광주 여행을 찾아볼까요?
      </h2>
      <p className="text-neutral-04 mt-2 text-[13px] leading-[1.5]">
        성향 검사로 딱 맞는 코스를 추천받고,
        <br />
        팀과 함께 5월의 광주를 밝혀보세요.
      </p>

      <Button
        variant="solid"
        size="lg"
        className="mt-6 w-full"
        onClick={() => router.push("/onboarding")}
      >
        성향 검사 시작하기
      </Button>

      <button
        type="button"
        onClick={onLoginClick}
        className="text-neutral-04 hover:text-neutral-06 mt-4 flex min-h-11 w-full items-center justify-center text-[13px]"
      >
        이미 계정이 있으신가요?
        <span className="text-neutral-07 ml-1 font-semibold">로그인</span>
      </button>

      <nav
        className="border-neutral-03 mt-8 border-t pt-3"
        aria-label="서비스 메뉴"
      >
        <Link
          href="/"
          className="text-neutral-07 flex min-h-12 items-center text-[14px] font-medium"
        >
          서비스 소개
        </Link>
      </nav>
    </div>
  );
};

export default SidebarNewUser;