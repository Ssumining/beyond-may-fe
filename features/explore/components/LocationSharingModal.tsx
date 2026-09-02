"use client";

import useUpdateLocationSharingMutation from "@/features/explore/hooks/useUpdateLocationSharingMutation";

interface LocationSharingModalProps {
  explorationId: string;
  /** 선택 완료 시 (공유 여부 관계없이 모달 닫기) */
  onClose: () => void;
}

/**
 * 위치 공유 옵트인 모달 (4.3.2).
 * 탐험 지도 최초 진입 시 표시. 기본값은 비공유,
 * "공유하기" 선택 시에만 PATCH로 위치 공유 on.
 */
const LocationSharingModal = ({
  explorationId,
  onClose,
}: LocationSharingModalProps) => {
  const { mutate, isPending } = useUpdateLocationSharingMutation(explorationId);

  const handleShare = (): void => {
    mutate(
      { enabled: true },
      {
        onSettled: onClose, // 성공·실패 관계없이 닫기
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />

      {/* 모달 */}
      <div
        role="dialog"
        aria-label="위치 공유 여부 선택"
        className="bg-white-01 relative w-full max-w-83 rounded-[20px] px-6 py-7 shadow-[0_0_50px_rgba(0,0,0,0.3)]"
      >
        <h2 className="text-neutral-07 text-left text-[17px] font-bold">
          내 위치를 팀과 공유할까요?
        </h2>
        <p className="text-neutral-04 mt-5 text-left text-[12px] leading-relaxed">
          공유하면 팀원 지도에 내 위치가 표시돼요. 기본값은 &lsquo;공유 안
          함&rsquo;이며 설정에서 언제든 바꿀 수 있어요.
        </p>

        <div className="mt-5 flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="border-neutral-05 text-neutral-05 flex-1 rounded-3xl border py-4 text-[15px] font-bold"
          >
            공유 안 함
          </button>
          <button
            type="button"
            onClick={handleShare}
            disabled={isPending}
            className="bg-neutral-07 text-white-01 disabled:bg-neutral-03 flex-1 rounded-3xl py-4 text-[15px] font-bold"
          >
            {isPending ? "설정 중…" : "공유하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationSharingModal;
