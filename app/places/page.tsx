"use client";

import { useState } from "react";

import AppHeader from "@/components/layout/AppHeader";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import SidebarProfileMenu from "@/components/layout/sidebar/SidebarProfileMenu";
import PlaceDetailSheet from "@/components/place-detail/PlaceDetailSheet";
import CircleIconButton from "@/components/ui/CircleIconButton";
import Close from "@/components/ui/icons/Close";
import PlaceCardDeck from "@/features/places/components/PlaceCardDeck";
import PlaceSwipeGuide from "@/features/places/components/PlaceSwipeGuide";
import useGetPlaceDetailQuery from "@/features/places/hooks/useGetPlaceDetailQuery";
import useGetPlaceRecommendationsQuery from "@/features/places/hooks/useGetPlaceRecommendationsQuery";

/**
 * 장소 선택 화면 (기능명세 2.1.1).
 * 닉네임/세션 등록 완료 후 진입, 추천 장소 카드덱을 보여준다.
 *
 * 카드덱 UI·데이터 로딩까지만 다루고, 스와이프(좋아요/싫어요) 제스처는 후속 이슈에서 붙인다.
 */
export default function PlacesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  // 스와이프 사용법 안내를 본 뒤에만 실제 카드덱을 보여준다
  const [hasSeenGuide, setHasSeenGuide] = useState(false);

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

  return (
    <main className="bg-neutral-01 relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col px-6">
      {hasPlaces && !hasSeenGuide && (
        <PlaceSwipeGuide
          placeCount={places.length}
          onOpenMenu={handleOpenMenu}
          onStart={() => setHasSeenGuide(true)}
        />
      )}

      {(!hasPlaces || hasSeenGuide) && (
        <>
          <AppHeader
            onOpenMenu={handleOpenMenu}
            // 스와이프로 지나친 개수는 후속 이슈에서 연결 전까지 0으로 고정
            centerLabel={places && `0/${places.length}`}
          />

          <div className="flex flex-1 flex-col items-center justify-center">
            {isLoading && (
              <p className="text-neutral-04 text-[15px]">
                추천 장소를 불러오고 있어요…
              </p>
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

            {hasPlaces && (
              <PlaceCardDeck
                places={places}
                onSelectTopPlace={setSelectedPlaceId}
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
