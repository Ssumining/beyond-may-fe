"use client";
import FullPageState from "@/components/ui/FullPageState";

const ExpiredState = () => (
  <FullPageState
    eyebrow="만료된 링크"
    title="링크가 만료되었어요"
    description="코스를 만든 분에게 새 링크를 요청해 주세요."
    actionLabel="홈으로"
    actionHref="/"
  />
);

export default ExpiredState;
