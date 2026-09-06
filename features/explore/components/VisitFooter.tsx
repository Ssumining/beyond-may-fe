"use client";

import { useState } from "react";
import useGeolocationStore from "@/stores/geolocationStore";
import useCreateVisitMutation from "@/features/explore/hooks/useCreateVisitMutation";
import {
  getDistanceInMeters,
  isWithinVisitRadius,
  formatRemainingDistance,
} from "@/lib/geo/distance";
import type { VisitResponse } from "@/types/exploration";

interface VisitFooterProps {
  /** 인증할 장소 ID */
  placeId: number;
  /** 장소 좌표 (거리 계산용) */
  latitude: number;
  longitude: number;
  /** 이미 방문했는지 (부모가 밝힌 장소 조회로 판단해 전달) */
  isVisited: boolean;
  /** 현재 탐험 ID */
  explorationId: number;
  /** 인증 성공 시 */
  onVisitSuccess: (response: VisitResponse) => void;
  /** 인증 후 시트 닫기 */
  onClose: () => void;
}

const VisitFooter = ({
  placeId,
  latitude,
  longitude,
  isVisited,
  explorationId,
  onVisitSuccess,
  onClose,
}: VisitFooterProps) => {
  const coordinates = useGeolocationStore((state) => state.coordinates);
  const { mutate, isPending, isSuccess } = useCreateVisitMutation();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const distance = coordinates
    ? getDistanceInMeters(
        { latitude: coordinates.latitude, longitude: coordinates.longitude },
        { latitude, longitude },
      )
    : null;

  const withinRadius =
    coordinates !== null &&
    isWithinVisitRadius(
      { latitude: coordinates.latitude, longitude: coordinates.longitude },
      { latitude, longitude },
    );

  const canVerify =
    !isVisited && withinRadius && coordinates !== null && !isPending;

  const handleVerify = (): void => {
    if (!coordinates) {
      return;
    }
    setErrorMessage(null);

    mutate(
      {
        explorationId,
        placeId,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        accuracyMeters: coordinates.accuracy,
      },
      {
        onSuccess: (response) => {
          onVisitSuccess(response);
          // "인증 완료"를 잠깐 보여준 뒤 시트 닫기
          setTimeout(onClose, 1000);
        },
        onError: () => {
          setErrorMessage("인증에 실패했어요. 잠시 후 다시 시도해 주세요.");
        },
      },
    );
  };

  // 버튼 텍스트 3단계 (이미 방문했거나 방금 성공하면 "인증 완료")
  const buttonLabel =
    isVisited || isSuccess
      ? "인증 완료"
      : isPending
        ? "인증 중…"
        : "지도 밝히기 (방문 인증)";

  return (
    <div>
      {/* 방문 상태별 안내 */}
      {isVisited ? (
        <p className="text-neutral-04 mb-3 text-sm">이미 인증한 장소예요.</p>
      ) : !withinRadius && distance !== null ? (
        <p className="text-neutral-04 mb-3 text-sm">
          {formatRemainingDistance(distance)}
        </p>
      ) : null}

      {errorMessage && (
        <p className="text-caution-02 mb-2 text-sm">{errorMessage}</p>
      )}

      <button
        type="button"
        onClick={handleVerify}
        disabled={!canVerify || isSuccess}
        className="bg-neutral-07 text-white-01 disabled:bg-neutral-03 w-full rounded-xl py-3 font-bold"
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default VisitFooter;
