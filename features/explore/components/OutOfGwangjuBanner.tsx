"use client";

interface OutOfGwangjuBannerProps {
  onGoToGwangju?: () => void;
}

/**
 * 광주 밖 안내 배너 (4.4.1).
 * 현재 위치가 광주 밖이면 방문 인증·주변 추천 비활성 안내.
 */
const OutOfGwangjuBanner = ({ onGoToGwangju }: OutOfGwangjuBannerProps) => (
  <div className="bg-neutral-01 absolute inset-x-0 bottom-0 z-30 mx-auto max-w-[430px] px-6 pt-5 pb-[max(24px,env(safe-area-inset-bottom))]">
    <p className="text-neutral-07 text-[16px] font-bold">
      광주에서 방문 인증을 체험해 보세요
    </p>
    <p className="text-neutral-04 mt-1.5 text-[13px] leading-[1.55]">
      광주 밖이거나 위치 권한이 없어 방문 인증·주변 추천을 쓸 수 없어요. 아래를
      누르면 광주에서 코스를 자동으로 체험할 수 있어요.
    </p>
    <button
      type="button"
      onClick={onGoToGwangju}
      disabled={!onGoToGwangju}
      className="bg-neutral-07 text-neutral-01 disabled:bg-neutral-02 disabled:text-neutral-04 mt-4 min-h-12 w-full rounded-full text-[15px] font-semibold disabled:cursor-not-allowed"
    >
      광주에서 체험 시작
    </button>
  </div>
);

export default OutOfGwangjuBanner;
