"use client";

import { cn } from "@/lib/cn";
import CircleIconButton from "@/components/ui/CircleIconButton";
import ImageIcon from "@/components/ui/icons/Image";
import Undo from "@/components/ui/icons/Undo";
import Close from "@/components/ui/icons/Close";
import HeartFilled from "@/components/ui/icons/HeartFilled";
import type { PlaceRecommendationResponse } from "@/types/place";

interface PlaceCardDeckProps {
  places: PlaceRecommendationResponse[];
  /** 최상단 카드 탭 시 (장소 상세 열기) */
  onSelectTopPlace: (placeId: number) => void;
}

/** 겹쳐 보일 뒷카드 수 (최상단 포함) */
const MAX_VISIBLE_CARDS = 3;

/**
 * 장소 선택 카드덱 (기능명세 2.1.1).
 * 뒤에 살짝 겹친 카드 스택으로 보여주고, 최상단 카드만 탭해서 상세를 열 수 있다.
 * 하단 되돌리기·싫어요·좋아요 버튼은 디자인상 노출되지만,
 * 실제 스와이프·되돌리기 동작은 후속 이슈에서 이 카드덱 위에 붙인다.
 */
const PlaceCardDeck = ({ places, onSelectTopPlace }: PlaceCardDeckProps) => {
  const visiblePlaces = places.slice(0, MAX_VISIBLE_CARDS);

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-134 w-75">
        {[...visiblePlaces].reverse().map((place, reversedIndex) => {
          const stackIndex = visiblePlaces.length - 1 - reversedIndex;
          const isTop = stackIndex === 0;

          return (
            <div
              key={place.placeId}
              role={isTop ? "button" : undefined}
              tabIndex={isTop ? 0 : undefined}
              onClick={
                isTop ? () => onSelectTopPlace(place.placeId) : undefined
              }
              className={cn(
                "bg-neutral-02 absolute inset-0 overflow-hidden rounded-[40px]",
                isTop ? "cursor-pointer" : "pointer-events-none",
              )}
              style={{
                transform: `translateY(${stackIndex * 8}px) scale(${1 - stackIndex * 0.04})`,
                zIndex: visiblePlaces.length - stackIndex,
              }}
            >
              {place.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={place.thumbnailUrl}
                  alt={place.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImageIcon className="text-neutral-04 h-10 w-10" />
                </div>
              )}

              {isTop && (
                <>
                  <span className="bg-neutral-01 text-neutral-04 absolute top-5 left-5 rounded-full px-3.5 py-1.5 text-[13px]">
                    {place.category}
                  </span>

                  <div className="from-neutral-07/70 absolute inset-x-0 bottom-0 bg-linear-to-t to-transparent px-5 pt-16 pb-6">
                    <h3 className="text-neutral-01 text-[18px] font-semibold">
                      {place.name}
                    </h3>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* TODO: 되돌리기·싫어요·좋아요는 스와이프 이슈에서 실제 동작 연결 */}
      <div className="relative mt-9 flex w-75 items-center justify-center gap-6">
        <CircleIconButton
          icon={<Undo className="h-5 w-5" />}
          disabled
          aria-label="되돌리기"
          className="absolute left-0 h-12 w-12"
        />
        <CircleIconButton
          icon={<Close className="h-6 w-6" />}
          disabled
          aria-label="싫어요"
          className="h-15 w-15"
        />
        <CircleIconButton
          icon={<HeartFilled className="h-6 w-6" />}
          variant="dark"
          disabled
          aria-label="좋아요"
          className="h-18 w-18"
        />
      </div>
    </div>
  );
};

export default PlaceCardDeck;
