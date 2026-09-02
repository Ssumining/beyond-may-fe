"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";

import { cn } from "@/lib/cn";
import CircleIconButton from "@/components/ui/CircleIconButton";
import ImageIcon from "@/components/ui/icons/Image";
import Undo from "@/components/ui/icons/Undo";
import Close from "@/components/ui/icons/Close";
import HeartFilled from "@/components/ui/icons/HeartFilled";
import type { PlaceRecommendationResponse } from "@/types/place";

type SwipeDirection = "like" | "dislike";

interface PlaceCardDeckProps {
  places: PlaceRecommendationResponse[];
  /** 지금까지 좋아요로 담은 장소 수 (늘어날 때마다 알림을 띄우는 데 사용) */
  likedCount: number;
  /** 최상단 카드 탭 시 (장소 상세 열기) */
  onSelectTopPlace: (placeId: number) => void;
  /** 좋아요/싫어요 확정 시 (제스처·버튼 공통) */
  onSwipe: (direction: SwipeDirection) => void;
  onUndo: () => void;
  canUndo: boolean;
}

/** 담은 장소 알림이 떠 있는 시간 (ms) */
const LIKED_TOAST_DURATION = 1600;

/** 겹쳐 보일 뒷카드 수 (최상단 포함) */
const MAX_VISIBLE_CARDS = 3;
/** 이 이상 드래그하면 스와이프로 확정 (px) */
const SWIPE_DISTANCE_THRESHOLD = 120;
/** 짧게 튕기듯 스와이프해도 확정되는 속도 기준 (px/s) */
const SWIPE_VELOCITY_THRESHOLD = 500;
const EXIT_X = 500;

/**
 * 장소 선택 카드덱 (기능명세 2.1.1~2.1.3).
 * 뒤에 살짝 겹친 카드 스택으로 보여주고, 최상단 카드만 탭해서 상세를 열거나
 * 좌우로 드래그해서 싫어요/좋아요를 확정할 수 있다. 하단 버튼도 같은 동작을 한다.
 *
 * 확정과 동시에 onSwipe로 부모 상태를 바로 갱신해 다음 카드가 즉시 앞으로 나오게 하고,
 * 날아가는 카드는 AnimatePresence의 exit로 화면에서 독립적으로 사라진다
 * (상태 갱신을 기다렸다가 다음 카드를 보여주면 그 사이 뚝 끊기는 느낌이 남).
 */
const PlaceCardDeck = ({
  places,
  likedCount,
  onSelectTopPlace,
  onSwipe,
  onUndo,
  canUndo,
}: PlaceCardDeckProps) => {
  const visiblePlaces = places.slice(0, MAX_VISIBLE_CARDS);
  const topPlace = visiblePlaces[0];
  // 방금 나간 카드가 어느 방향으로 날아갈지 (exit 애니메이션에 사용)
  const [exitState, setExitState] = useState<{
    direction: SwipeDirection;
    velocityX: number;
  }>({ direction: "like", velocityX: 0 });
  // 드래그가 실제로 일어났는지 (tap 오작동 방지용)
  const didDrag = useRef(false);
  const [showLikedToast, setShowLikedToast] = useState(false);
  const prevLikedCount = useRef(likedCount);

  // likedCount가 늘어날 때만(되돌리기로 줄어들 땐 제외) 알림을 띄운다
  useEffect(() => {
    if (likedCount > prevLikedCount.current) {
      setShowLikedToast(true);
      const timer = setTimeout(
        () => setShowLikedToast(false),
        LIKED_TOAST_DURATION,
      );
      prevLikedCount.current = likedCount;
      return () => clearTimeout(timer);
    }
    prevLikedCount.current = likedCount;
  }, [likedCount]);

  const commitSwipe = (direction: SwipeDirection, velocityX = 0) => {
    if (!topPlace) return;
    setExitState({ direction, velocityX });
    onSwipe(direction);
  };

  const handleDrag = (
    _event: PointerEvent | MouseEvent | TouchEvent,
    info: PanInfo,
  ) => {
    if (Math.abs(info.offset.x) > 4) {
      didDrag.current = true;
    }
  };

  const handleDragEnd = (
    _event: PointerEvent | MouseEvent | TouchEvent,
    info: PanInfo,
  ) => {
    if (
      info.offset.x > SWIPE_DISTANCE_THRESHOLD ||
      info.velocity.x > SWIPE_VELOCITY_THRESHOLD
    ) {
      commitSwipe("like", info.velocity.x);
      return;
    }
    if (
      info.offset.x < -SWIPE_DISTANCE_THRESHOLD ||
      info.velocity.x < -SWIPE_VELOCITY_THRESHOLD
    ) {
      commitSwipe("dislike", info.velocity.x);
    }
    // 임계값 미달이면 dragConstraints(고정점)에 의해 자동으로 중앙 복귀
  };

  const handleTap = (placeId: number) => {
    if (didDrag.current) {
      didDrag.current = false;
      return;
    }
    onSelectTopPlace(placeId);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-134 w-75">
        <AnimatePresence>
          {showLikedToast && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="bg-neutral-07 text-neutral-01 absolute top-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-4 py-2 text-[14px] font-medium"
            >
              <HeartFilled className="h-3.5 w-3.5" />
              담은 장소 {likedCount}개
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {visiblePlaces.map((place, stackIndex) => {
            const isTop = stackIndex === 0;

            return (
              <motion.div
                key={place.placeId}
                drag={isTop ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onPointerDown={
                  isTop
                    ? () => {
                        didDrag.current = false;
                      }
                    : undefined
                }
                onDrag={isTop ? handleDrag : undefined}
                onDragEnd={isTop ? handleDragEnd : undefined}
                onTap={isTop ? () => handleTap(place.placeId) : undefined}
                initial={false}
                animate={{
                  x: 0,
                  y: stackIndex * 8,
                  scale: 1 - stackIndex * 0.04,
                  rotate: 0,
                  opacity: 1,
                }}
                exit={{
                  x: exitState.direction === "like" ? EXIT_X : -EXIT_X,
                  rotate: exitState.direction === "like" ? 24 : -24,
                  opacity: 0,
                  transition: {
                    type: "spring",
                    stiffness: 180,
                    damping: 20,
                    mass: 0.6,
                    velocity: exitState.velocityX,
                  },
                }}
                transition={{ type: "spring", stiffness: 350, damping: 26 }}
                style={{ zIndex: visiblePlaces.length - stackIndex }}
                className={cn(
                  "bg-neutral-02 absolute inset-0 overflow-hidden rounded-[40px]",
                  isTop
                    ? "cursor-grab active:cursor-grabbing"
                    : "pointer-events-none",
                )}
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
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="relative mt-9 flex w-75 items-center justify-center gap-6">
        <CircleIconButton
          icon={<Undo className="h-5 w-5" />}
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="되돌리기"
          className="absolute left-0 h-12 w-12"
        />
        <CircleIconButton
          icon={<Close className="h-6 w-6" />}
          onClick={() => commitSwipe("dislike")}
          disabled={!topPlace}
          aria-label="싫어요"
          className="h-15 w-15"
        />
        <CircleIconButton
          icon={<HeartFilled className="h-6 w-6" />}
          variant="dark"
          onClick={() => commitSwipe("like")}
          disabled={!topPlace}
          aria-label="좋아요"
          className="h-18 w-18"
        />
      </div>
    </div>
  );
};

export default PlaceCardDeck;
