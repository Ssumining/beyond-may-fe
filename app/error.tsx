"use client";

import AppHeader from "@/components/layout/AppHeader";
import ErrorView from "@/components/error/ErrorView";
import Button from "@/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * 서버/렌더 오류 화면 (기능명세 6.1.2).
 * 하위 렌더 중 에러 발생 시 Next.js가 자동 렌더. reset으로 다시 시도.
 */
const ErrorPage = ({ reset }: ErrorProps) => {
  return (
    <main className="bg-neutral-01 mx-auto flex min-h-dvh w-full max-w-[430px] flex-col">
      <AppHeader showMenu={false} className="text-neutral-07" />
      <ErrorView
        code="500"
        title="일시적인 서버 오류가 발생했어요"
        description={"문제를 확인하고 있어요.\n잠시 후 다시 시도해 주세요."}
        actions={
          <Button
            variant="solid"
            size="lg"
            onClick={reset}
            className="w-[330px]"
          >
            다시 시도
          </Button>
        }
      />
    </main>
  );
};

export default ErrorPage;
