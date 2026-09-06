"use client";

import AppHeader from "@/components/layout/AppHeader";
import Button from "@/components/ui/Button";
import CircleIconButton from "@/components/ui/CircleIconButton";
import ArrowRight from "@/components/ui/icons/ArrowRight";
import Close from "@/components/ui/icons/Close";
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
  return (
    <div className="flex flex-1 flex-col">
      <AppHeader
        backHref="/onboarding/result"
        onOpenMenu={onOpenMenu}
        centerLabel="장소 고르기"
        className="-mx-6"
      />

      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <p className="text-primary-08 text-[12px] font-semibold tracking-[0.12em]">
          HOW IT WORKS
        </p>
        <h1 className="text-neutral-07 mt-3 text-[28px] leading-[1.3] font-bold">
          나에게 어울리는 장소
          <br />
          {placeCount}곳을 준비했어요
        </h1>

        <div className="mt-10 flex items-center gap-6">
          <ArrowRight className="text-neutral-04 h-5 w-5 rotate-180 opacity-50" />

          <div className="relative h-28 w-22.5">
            <div className="bg-neutral-07/20 rounded-card absolute inset-0 -translate-x-1.5 translate-y-1" />
            <div className="border-neutral-07 bg-neutral-01 shadow-soft rounded-card motion-safe:animate-card-sway absolute inset-0 overflow-hidden border-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/place.jpg"
                alt=""
                aria-hidden="true"
                className="h-full w-full scale-175 object-cover object-[center_42%]"
              />
            </div>
          </div>

          <ArrowRight className="text-neutral-07 h-5 w-5" />
        </div>

        <p className="text-neutral-04 mt-8 text-[15px] leading-[1.6]">
          가고 싶은 장소는 오른쪽으로 담고,
          <br />
          나중에 볼 장소는 왼쪽으로 넘겨요.
        </p>

        <div className="mt-8 flex items-center gap-6">
          <CircleIconButton
            icon={<Close className="h-6 w-6" />}
            aria-label="싫어요"
            className="text-neutral-06 h-16 w-16"
          />
          <CircleIconButton
            icon={<HeartFilled className="h-6 w-6" />}
            variant="dark"
            aria-label="좋아요"
            className="bg-location h-16 w-16"
          />
        </div>
      </div>

      <Button
        variant="solid"
        size="lg"
        onClick={onStart}
        className="mb-[max(24px,env(safe-area-inset-bottom))] w-full"
      >
        장소 고르기 시작
      </Button>
    </div>
  );
};

export default PlaceSwipeGuide;
