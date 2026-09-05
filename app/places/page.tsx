"use client";

import { useState } from "react";

import AppHeader from "@/components/layout/AppHeader";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import SidebarProfileMenu from "@/components/layout/sidebar/SidebarProfileMenu";
import PlaceDetailSheet from "@/components/place-detail/PlaceDetailSheet";
import CircleIconButton from "@/components/ui/CircleIconButton";
import Close from "@/components/ui/icons/Close";
import ImageIcon from "@/components/ui/icons/Image";
import PlaceCardDeck from "@/features/places/components/PlaceCardDeck";
import PlaceSwipeGuide from "@/features/places/components/PlaceSwipeGuide";
import TripDurationSelect, {
  type TripDurationRange,
} from "@/features/places/components/TripDurationSelect";
import useGetPlaceDetailQuery from "@/features/places/hooks/useGetPlaceDetailQuery";
import useGetPlaceRecommendationsQuery from "@/features/places/hooks/useGetPlaceRecommendationsQuery";

/**
 * 장소 선택 화면 (기능명세 2.1.1~2.1.3).
 * 닉네임/세션 등록 완료 후 진입, 여행 기간 선택 → 스와이프 안내 → 추천 장소
 * 카드덱 순서로 진행한다. 좋아요는 우측 스와이프/하트, 싫어요는 좌측 스와이프/X,
 * 직전 1건 되돌리기를 지원한다.
 *
 * TODO(백엔드 확인): 좋아요한 장소 목록을 서버에 저장하는 API 미확정 —
 *   우선 클라이언트 상태로만 관리. (backend)
 */
export default function PlacesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  // 여행 기간을 고르기 전엔 안내·카드덱 모두 보여주지 않는다
  const [durationRange, setDurationRange] = useState<TripDurationRange | null>(
    null,
  );
  // 스와이프 사용법 안내를 본 뒤에만 실제 카드덱을 보여준다
  const [hasSeenGuide, setHasSeenGuide] = useState(false);
  // 스와이프로 지나친(좋아요+싫어요) placeId, 되돌리기 위해 순서 유지
  const [swipedPlaceIds, setSwipedPlaceIds] = useState<number[]>([]);
  const [likedPlaceIds, setLikedPlaceIds] = useState<Set<number>>(new Set());

  const {
    data: places,
    isLoading,
    isError,
  } = useGetPlaceRecommendationsQuery();
  const { data: placeDetail, isPending: isPlaceDetailPending } =
    useGetPlaceDetailQuery(selectedPlaceId);

  const handleClose = () => setSelectedPlaceId(null);
  const handleOpenMenu = () => setIsMenuOpen(true);

  const hasPlaces = !isLoading && !isError && places && places.length > 0;
  const remainingPlaces =
    places?.filter((place) => !swipedPlaceIds.includes(place.placeId)) ?? [];
  const isDeckComplete = hasPlaces && remainingPlaces.length === 0;
  const canUndo = swipedPlaceIds.length > 0;

  const handleSwipe = (direction: "like" | "dislike") => {
    const topPlace = remainingPlaces[0];
    if (!topPlace) return;

    setSwipedPlaceIds((prev) => [...prev, topPlace.placeId]);
    if (direction === "like") {
      setLikedPlaceIds((prev) => new Set(prev).add(topPlace.placeId));
    }
  };

  const handleUndo = () => {
    if (swipedPlaceIds.length === 0) return;
    const lastPlaceId = swipedPlaceIds[swipedPlaceIds.length - 1];

    setSwipedPlaceIds((prev) => prev.slice(0, -1));
    setLikedPlaceIds((prev) => {
      if (!prev.has(lastPlaceId)) return prev;
      const next = new Set(prev);
      next.delete(lastPlaceId);
      return next;
    });
  };

  return (
    <main className="bg-screen-gradient relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col px-6">
      {!durationRange && (
        <TripDurationSelect
          onOpenMenu={handleOpenMenu}
          onConfirm={setDurationRange}
        />
      )}

      {durationRange && hasPlaces && !hasSeenGuide && (
        <PlaceSwipeGuide
          placeCount={places.length}
          onOpenMenu={handleOpenMenu}
          onStart={() => setHasSeenGuide(true)}
        />
      )}

      {durationRange && (!hasPlaces || hasSeenGuide) && (
        <>
          <AppHeader
            onOpenMenu={handleOpenMenu}
            centerLabel={places && `${swipedPlaceIds.length}/${places.length}`}
            onOpenHelp={
              likedPlaceIds.size > 0 ? () => setHasSeenGuide(false) : undefined
            }
          />

          <div className="flex flex-1 flex-col items-center justify-center">
            {isLoading && (
              <div className="flex flex-col items-center gap-6">
                <div className="border-neutral-03 bg-neutral-02 animate-card-sway flex h-28 w-20 items-center justify-center rounded-2xl border">
                  <ImageIcon className="text-neutral-04 h-7 w-7" />
                </div>
                <p className="text-neutral-04 text-[15px]">
                  추천 장소를 불러오고 있어요…
                </p>
              </div>
            )}

            {isError && (
              <p className="text-neutral-04 text-[15px]">
                장소 정보를 불러오지 못했어요.
              </p>
            )}

            {!isLoading && !isError && places?.length === 0 && (
              <p className="text-neutral-04 text-[15px]">
                추천할 장소가 더 이상 없어요.
              </p>
            )}

            {isDeckComplete && (
              <p className="text-neutral-04 px-8 text-center text-[15px]">
                모든 장소를 확인했어요!
                <br />
                좋아요한 장소 {likedPlaceIds.size}곳을 담아뒀어요.
              </p>
            )}

            {hasPlaces && !isDeckComplete && (
              <PlaceCardDeck
                places={remainingPlaces}
                likedCount={likedPlaceIds.size}
                onSelectTopPlace={setSelectedPlaceId}
                onSwipe={handleSwipe}
                onUndo={handleUndo}
                canUndo={canUndo}
              />
            )}
          </div>
        </>
      )}

      {selectedPlaceId !== null && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/12 backdrop-blur-xl"
            onClick={handleClose}
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-97.5">
            {isPlaceDetailPending || !placeDetail ? (
              <div className="bg-neutral-01 rounded-t-2xl p-6 text-center">
                <p className="text-neutral-04 text-sm">
                  장소 정보를 불러오고 있어요…
                </p>
              </div>
            ) : (
              <PlaceDetailSheet
                place={placeDetail}
                footer={
                  <CircleIconButton
                    icon={<Close className="h-4 w-4" />}
                    onClick={handleClose}
                    aria-label="닫기"
                    className="ml-auto h-14 w-14"
                  />
                }
              />
            )}
          </div>
        </div>
      )}

      <Sidebar open={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <SidebarProfileMenu />
      </Sidebar>
    </main>
  );
}
