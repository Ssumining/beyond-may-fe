"use client";
import FullPageState from "@/components/ui/FullPageState";

const CompletedExplorationState = () => (
  <FullPageState
    eyebrow="완료된 탐험"
    title="이미 완료한 탐험이에요"
    description="이 코스의 탐험은 이미 끝났어요."
    actionLabel="홈으로"
    actionHref="/"
  />
);

export default CompletedExplorationState;