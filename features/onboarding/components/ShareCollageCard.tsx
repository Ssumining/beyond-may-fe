import { forwardRef } from "react";

import { cn } from "@/lib/cn";
import type { PreferenceResultResponse } from "@/types/preference";
import { getResultTheme } from "@/features/onboarding/utils/resultTheme";
import StampPhoto from "@/features/onboarding/components/StampPhoto";

interface ShareCollageCardProps {
  result: PreferenceResultResponse;
  className?: string;
}

/** 콜라주에 쓸 추천 장소 사진 개수 (우표 사진 1장 포함) */
const COLLAGE_PHOTO_COUNT = 5;

type Place = PreferenceResultResponse["recommendedPlaces"][number];

/** 그리드 한 칸 크기의 우표. flex-N 사이징은 부모(sizing wrapper)가 담당한다. */
const StampTile = ({
  place,
  className,
  rotateClassName,
}: {
  place?: Place;
  className: string;
  rotateClassName?: string;
}) => (
  <div className={cn("relative", className)}>
    <StampPhoto
      src={place?.placeImg}
      alt={place?.placeName ?? ""}
      className={rotateClassName}
    />
  </div>
);

/**
 * 결과 공유 "정사각형(스토리형)" 카드 — 버전 2 (이슈 #29).
 *
 * 유형별 그라디언트 배경 위에 추천 장소 사진 전부를 우표 모양(사방 톱니)
 * 스탬프로 오려 콜라주처럼 배치한다. 대표 사진(1번)만 살짝 기울여
 * 핵심 모티프로 강조하고, 텍스트는 유형명만 두어 인스타그램 스토리 등
 * 비주얼 공유용으로 쓴다.
 */
const ShareCollageCard = forwardRef<HTMLDivElement, ShareCollageCardProps>(
  ({ result, className }, ref) => {
    const { type, mbtiName, recommendedPlaces } = result;
    const theme = getResultTheme(type);
    const places = recommendedPlaces.slice(0, COLLAGE_PHOTO_COUNT);
    const [hero, topRight, midRight, bottomLeft, bottomRight] = places;

    // 예술러/미식러처럼 배경이 밝은 톤이면 글자를 어둡게(neutral-07), 아니면 밝게(neutral-01).
    const text = theme.isLight ? "text-neutral-07" : "text-neutral-01";
    const text70 = theme.isLight ? "text-neutral-07/70" : "text-neutral-01/70";

    return (
      <div
        ref={ref}
        className={cn(
          "relative aspect-576/733 w-full overflow-hidden",
          className,
        )}
        style={{
          background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
        }}
      >
        <div className="grid h-full grid-cols-2 gap-3 p-4 pb-23">
          {/* 왼쪽 열: 대표 우표(핵심 모티프) + 하단 우표 1장 */}
          <div className="relative flex flex-col gap-3">
            <div className="relative z-10 flex-31 pb-1">
              <StampTile place={hero} className="h-full" />
            </div>

            <StampTile place={bottomLeft} className="flex-32" />
          </div>

          {/* 오른쪽 열: 우표 3장 */}
          <div className="flex flex-col gap-3">
            <StampTile place={topRight} className="flex-22" />
            <StampTile place={midRight} className="flex-21" />
            <StampTile place={bottomRight} className="flex-40" />
          </div>
        </div>

        {/* 하단: 유형명만 표시 (비주얼 공유용) */}
        <div className="absolute inset-x-0 bottom-0 px-6 py-5">
          <h1 className={cn(text, "text-[34px] leading-tight font-bold")}>
            {mbtiName}
          </h1>
          <p className={cn(text70, "mt-1 text-[10px] tracking-widest")}>
            GWANGJU · BEYOND MAY
          </p>
        </div>
      </div>
    );
  },
);

ShareCollageCard.displayName = "ShareCollageCard";

export default ShareCollageCard;
