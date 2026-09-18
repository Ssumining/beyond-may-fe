"use client";

import { useId, useState } from "react";
import Link from "next/link";
import AppHeader from "@/components/layout/AppHeader";
import Toast from "@/components/ui/Toast";
import useSessionStore from "@/stores/sessionStore";
import useGetExplorationsQuery from "@/features/explore/hooks/useGetExplorationsQuery";
import useGetExplorationStatusQuery from "@/features/explore/hooks/useGetExplorationStatusQuery";
import useUpdateLocationSharingMutation from "@/features/explore/hooks/useUpdateLocationSharingMutation";

const SettingsPage = () => {
  const isLoggedIn = useSessionStore((state) => state.isLoggedIn);
  return (
    <main className="bg-neutral-01 mx-auto min-h-dvh w-full max-w-[430px] pb-[max(40px,env(safe-area-inset-bottom))]">
      <AppHeader
        backHref="/"
        showMenu={false}
        centerLabel={
          <span role="heading" aria-level={1}>
            설정
          </span>
        }
      />
      {isLoggedIn ? (
        <LocationSettings />
      ) : (
        <div className="px-6 py-12 text-center">
          <p className="text-neutral-04 text-[14px]">
            로그인하면 설정을 변경할 수 있어요.
          </p>
          <Link
            href="/"
            className="text-primary-08 mt-4 inline-flex min-h-11 items-center underline"
          >
            홈으로 이동
          </Link>
        </div>
      )}
    </main>
  );
};

const LocationSettings = () => {
  const [message, setMessage] = useState<string | null>(null);
  const {
    data: list,
    isPending: isListPending,
    isError: isListError,
  } = useGetExplorationsQuery("ONGOING");
  const ongoing = list?.explorations.find((item) => item.status === "ONGOING");
  const explorationId = ongoing ? String(ongoing.explorationId) : "";
  const {
    data: exploration,
    isPending,
    isFetching,
    isError,
  } = useGetExplorationStatusQuery(explorationId);
  const {
    mutate,
    isPending: isSaving,
    isError: isSaveError,
  } = useUpdateLocationSharingMutation(explorationId);
  const unavailableReason = isListPending
    ? "탐험 정보를 확인 중이에요."
    : isListError
      ? "탐험 정보를 불러오지 못했어요."
      : !ongoing
        ? "탐험을 시작하면 위치 공유를 설정할 수 있어요."
        : isPending || isFetching
          ? "위치 공유 설정을 확인 중이에요."
          : isError || !exploration
            ? "위치 공유 설정을 불러오지 못했어요."
            : exploration.status !== "ONGOING" ||
                exploration.currentParticipant.status !== "ACTIVE"
              ? "현재 참여 중인 탐험에서만 설정할 수 있어요."
              : isSaving
                ? "위치 공유 설정을 저장하고 있어요."
                : null;

  return (
    <section aria-label="팀원 위치 공유 설정" className="px-6 pt-4">
      <SettingToggle
        label="팀과 내 위치 공유"
        description="함께 탐험하는 팀원에게 내 위치를 공유해요."
        checked={
          exploration?.currentParticipant.locationSharingEnabled ?? false
        }
        unavailableReason={unavailableReason}
        onNotice={setMessage}
        onChange={() =>
          mutate({
            enabled: !exploration?.currentParticipant.locationSharingEnabled,
          })
        }
      />
      {isSaving && (
        <p role="status" className="text-neutral-04 mt-4 text-[13px]">
          저장하고 있어요.
        </p>
      )}
      {isSaveError && (
        <p role="alert" className="text-caution-02 mt-4 text-[13px]">
          위치 공유 설정을 저장하지 못했어요. 다시 시도해 주세요.
        </p>
      )}
      {message && <Toast message={message} onClose={() => setMessage(null)} />}
    </section>
  );
};

interface SettingToggleProps {
  label: string;
  description: string;
  checked: boolean;
  unavailableReason?: string | null;
  onNotice: (message: string) => void;
  onChange: () => void;
}

/** 비활성 상태도 키보드·클릭으로 사유를 확인할 수 있게 한다. */
const SettingToggle = ({
  label,
  description,
  checked,
  unavailableReason,
  onNotice,
  onChange,
}: SettingToggleProps) => {
  const descriptionId = useId();
  return (
    <div className="border-neutral-02 border-b">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={Boolean(unavailableReason)}
        aria-labelledby={`${descriptionId}-label`}
        aria-describedby={descriptionId}
        onClick={() =>
          unavailableReason ? onNotice(unavailableReason) : onChange()
        }
        className="group text-neutral-07 focus-visible:outline-primary-03 flex min-h-24 w-full cursor-pointer items-center justify-between gap-5 py-6 text-left focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <span className="min-w-0">
          <span
            id={`${descriptionId}-label`}
            className="block text-[15px] font-medium"
          >
            {label}
          </span>
          <span className="text-neutral-04 mt-1.5 block text-[13px] leading-[1.6] break-keep">
            {description}
          </span>
        </span>
        <span
          aria-hidden="true"
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors group-aria-disabled:opacity-40 ${checked ? "bg-primary-08" : "bg-neutral-03"}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : ""}`}
          />
        </span>
      </button>
      <span id={descriptionId} hidden>
        {unavailableReason ?? description}
      </span>
    </div>
  );
};

export default SettingsPage;
