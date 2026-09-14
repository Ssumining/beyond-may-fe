"use client";

import FullPageState from "@/components/ui/FullPageState";

interface ServerErrorStateProps {
  onRetry: () => void;
}

/** 일시적 서버 오류 화면 (6.1.2). app/error.tsx와 동일한 문구를 재사용 가능하게 분리. */
const ServerErrorState = ({ onRetry }: ServerErrorStateProps) => (
  <FullPageState
    eyebrow="잠시 문제가 생겼어요"
    title="일시적인 서버 오류가 발생했어요"
    description="문제를 확인하고 있어요. 잠시 후 다시 시도해 주세요."
    actionLabel="다시 시도"
    onAction={onRetry}
  />
);

export default ServerErrorState;