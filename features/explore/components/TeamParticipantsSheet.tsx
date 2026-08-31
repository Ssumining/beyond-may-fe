"use client";

import { cn } from "@/lib/cn";
import LocationOff from "@/components/ui/icons/LocationOff";
import type { ExplorationParticipant } from "@/types/exploration";

/** 아바타 배경색 후보 (participantId로 고정 선택) */
const AVATAR_COLORS = [
  "bg-neutral-07",
  "bg-neutral-06",
  "bg-neutral-04",
  "bg-neutral-05",
  "bg-neutral-03",
];

interface TeamParticipantsSheetProps {
  participantCount: number;
  participants: ExplorationParticipant[];
  isPending: boolean;
  isError: boolean;
  /** 탐험 진행 중 여부. true면 방문 수·위치 배지 표시, false(탐험 전)면 닉네임만 */
  isOngoing?: boolean;
  onClose: () => void;
}

const TeamParticipantsSheet = ({
  participantCount,
  participants,
  isPending,
  isError,
  isOngoing = true,
  onClose,
}: TeamParticipantsSheetProps) => {
  return (
    <div className="fixed inset-0 z-50">
      {/* 오버레이 */}
      <div
        className="absolute inset-0 bg-black/12 backdrop-blur-xl"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* 시트 */}
      <div className="bg-white-01 absolute inset-x-0 bottom-0 mx-auto max-w-97.5 rounded-t-2xl px-6 pt-4 pb-4">
        <div className="bg-neutral-03 mx-auto mb-7.5 h-1 w-10.5 rounded-full" />

        <h2 className="text-neutral-07 text-[18px] font-bold">
          팀원 {participantCount}명
        </h2>

        {isPending && (
          <p className="text-neutral-04 py-9 text-center text-[16px] font-semibold">
            팀원을 불러오고 있어요…
          </p>
        )}

        {isError && (
          <p className="text-neutral-04 py-9 text-center text-[16px] font-semibold">
            팀원 목록을 불러오지 못했어요.
          </p>
        )}

        {!isPending && !isError && (
          <ul className="mt-4 flex flex-col">
            {participants.map((participant) => (
              <li
                key={participant.participantId}
                className="border-neutral-02 flex items-center gap-3 border-b px-1.5 py-3.5 last:border-b-0"
              >
                <div
                  className={cn(
                    "text-white-01 flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold",
                    AVATAR_COLORS[
                      participant.participantId % AVATAR_COLORS.length
                    ],
                  )}
                >
                  {participant.displayName.charAt(0)}
                </div>

                <div className="flex-1">
                  <p className="text-neutral-07 text-[15px] font-medium">
                    {participant.displayName}
                  </p>
                  {isOngoing && (
                    <p className="text-neutral-04 text-[12px]">
                      {participant.visitedPlaceCount}개 완료
                    </p>
                  )}
                </div>

                {isOngoing && !participant.locationSharingEnabled && (
                  <span className="bg-neutral-02 text-neutral-04 flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] whitespace-nowrap">
                    <LocationOff className="h-2.5 w-2.5" />
                    위치 비공개
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        <p className="text-neutral-04 mt-4 text-[12px] leading-relaxed">
          {isOngoing
            ? "위치 미공유 팀원은 목록엔 노출되지만 지도에는 마커를 표시하지 않습니다."
            : "탐험 전이라 방문 완료 개수는 표시되지 않고 닉네임만 노출됩니다."}
        </p>
      </div>
    </div>
  );
};

export default TeamParticipantsSheet;
