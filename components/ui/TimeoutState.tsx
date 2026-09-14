"use client";
import FullPageState from "@/components/ui/FullPageState";

const TimeoutState = ({ onRetry }: { onRetry: () => void }) => (
  <FullPageState
    eyebrow="잠시만 기다려 주세요"
    title="시간이 오래 걸리고 있어요"
    description="다시 시도해 주세요."
    actionLabel="다시 시도"
    onAction={onRetry}
  />
);

export default TimeoutState;
