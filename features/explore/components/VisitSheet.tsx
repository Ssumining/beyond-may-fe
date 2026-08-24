// TODO: 혜진 공용 장소상세 컴포넌트로 교체 예정 (명세 4.4.2, 탐험용 방문 인증 버튼 분기)
// 현재는 기능 검증용 임시 UI. 공용 컴포넌트 완성 후 교체.

"use client";

import { useState } from "react";
import useGeolocationStore from "@/stores/geolocationStore";
import useCreateVisitMutation from "@/features/explore/hooks/useCreateVisitMutation";
import {
  getDistanceInMeters,
  isWithinVisitRadius,
  formatRemainingDistance,
} from "@/lib/geo/distance";
import type { CoursePlace } from "@/types/course";
import type { VisitResponse } from "@/types/exploration";

interface VisitSheetProps {
  /** 클릭한 코스 장소 */
  place: CoursePlace;
  /** 현재 탐험 ID */
  explorationId: number;
  /** 인증 성공 시 (핀 컬러 전환 등 상위에서 처리) */
  onVisitSuccess: (response: VisitResponse) => void;
  /** 시트 닫기 */
  onClose: () => void;
}

const VisitSheet = ({
  place,
  explorationId,
  onVisitSuccess,
  onClose,
}: VisitSheetProps) => {
  const coordinates = useGeolocationStore((state) => state.coordinates);
  const { mutate, isPending } = useCreateVisitMutation();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 내 위치 ↔ 장소 거리 계산 (좌표 없으면 계산 불가)
  const distance = coordinates
    ? getDistanceInMeters(
        { latitude: coordinates.latitude, longitude: coordinates.longitude },
        { latitude: place.location.lat, longitude: place.location.lng },
      )
    : null;

  const withinRadius =
    coordinates !== null &&
    isWithinVisitRadius(
      { latitude: coordinates.latitude, longitude: coordinates.longitude },
      { latitude: place.location.lat, longitude: place.location.lng },
    );

  // 이미 방문했거나, 반경 밖이거나, 좌표 없거나, 요청 중이면 비활성
  const canVerify =
    !place.visitStatus.isVisited &&
    withinRadius &&
    coordinates !== null &&
    !isPending;

  const handleVerify = (): void => {
    if (!coordinates) {
      return;
    }
    setErrorMessage(null);

    mutate(
      {
        explorationId,
        placeId: Number(place.placeId),
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        accuracyMeters: coordinates.accuracy,
      },
      {
        onSuccess: (response) => {
          onVisitSuccess(response);
          onClose();
        },
        onError: () => {
          setErrorMessage("인증에 실패했어요. 잠시 후 다시 시도해 주세요.");
        },
      },
    );
  };

  return (
    <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-5 shadow-lg">
      <p className="text-lg font-bold">{place.name}</p>
      {place.summary && (
        <p className="mt-1 text-sm text-gray-500">{place.summary}</p>
      )}

      {/* 방문 상태별 안내 */}
      {place.visitStatus.isVisited ? (
        <p className="mt-4 text-sm text-gray-500">이미 인증한 장소예요.</p>
      ) : !withinRadius && distance !== null ? (
        <p className="mt-4 text-sm text-gray-500">
          {formatRemainingDistance(distance)}
        </p>
      ) : null}

      {errorMessage && (
        <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
      )}

      <button
        type="button"
        onClick={handleVerify}
        disabled={!canVerify}
        className="mt-4 w-full rounded-xl bg-black py-3 font-bold text-white disabled:bg-gray-300"
      >
        {isPending ? "인증 중…" : "여기 왔어요"}
      </button>
    </div>
  );
};

export default VisitSheet;
