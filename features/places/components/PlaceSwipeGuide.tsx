"use client";

import { useRouter } from "next/navigation";

import CircleIconButton from "@/components/ui/CircleIconButton";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import ArrowRight from "@/components/ui/icons/ArrowRight";
import ChevronLeft from "@/components/ui/icons/ChevronLeft";
import Close from "@/components/ui/icons/Close";
import Hamburger from "@/components/ui/icons/Hamburger";
import HeartFilled from "@/components/ui/icons/HeartFilled";

interface PlaceSwipeGuideProps {
  /** 안내 문구에 들어갈 추천 장소 총 개수 */
  placeCount: number;
  onOpenMenu: () => void;
  /** TAB 눌러 카드덱 화면으로 진입 */
  onStart: () => void;
}

/**
 * 장소 카드덱 진입 전 스와이프 사용법 안내 화면 (기능명세 2.1.1).
 * 카드덱과 같은 X/하트 버튼을 실제와 동일한(비활성 아닌) 모습으로 미리 보여주지만,
 * 클릭 핸들러는 없다 — 사용법을 보여주는 용도이며 실제 스와이프는 카드덱에서 이뤄진다.
 */
const PlaceSwipeGuide = ({
  placeCount,
  onOpenMenu,
  onStart,
}: PlaceSwipeGuideProps) => {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col">
      <header className="text-neutral-04 flex items-center justify-between px-5 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="뒤로 가기"
          className="focus-visible:outline-neutral-07 cursor-pointer rounded-lg p-2 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="메뉴 열기"
          className="focus-visible:outline-neutral-07 cursor-pointer rounded-lg p-2 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Hamburger className="h-6 w-6" />
        </button>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <p className="text-neutral-07 text-[22px] leading-snug font-bold">
          취향에 맞을 것 같은 장소
          <br />
          {placeCount}곳을 골라봤어요.
        </p>

        <div className="mt-10 flex items-center gap-6">
          <ArrowRight className="text-neutral-04 h-5 w-5 rotate-180 opacity-50" />

          <div className="relative h-28 w-22.5">
            <div className="bg-neutral-07/20 absolute inset-0 -translate-x-1.5 translate-y-1 rounded-2xl" />
            <div className="animate-card-sway border-neutral-07 bg-neutral-01 absolute inset-0 rounded-2xl border-2" />
          </div>

          <ArrowRight className="text-neutral-07 h-5 w-5" />
        </div>

        <p className="text-neutral-06 mt-8 text-[15px] leading-relaxed">
          스와이프 해서 좋고 싫음을 알려주시면,
          <br />
          좋아하는 곳을 지도에 담아드려요.
        </p>

        <div className="mt-8 flex items-center gap-6">
          <CircleIconButton
            icon={<Close className="h-6 w-6" />}
            aria-label="싫어요"
            className="h-15 w-15"
          />
          <CircleIconButton
            icon={<HeartFilled className="h-6 w-6" />}
            variant="dark"
            aria-label="좋아요"
            className="h-18 w-18"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onStart}
        aria-label="장소 카드덱 보기"
        className="mb-10 flex cursor-pointer justify-center"
      >
        <ScrollIndicator label="TAB" />
      </button>
    </div>
  );
};

export default PlaceSwipeGuide;
