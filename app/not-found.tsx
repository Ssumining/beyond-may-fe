import AppHeader from "@/components/layout/AppHeader";
import ErrorView from "@/components/error/ErrorView";

/**
 * 404 페이지 (기능명세 6.1.1).
 * 존재하지 않는 라우트 접근 시 Next.js가 자동으로 렌더.
 */
const NotFound = () => {
  return (
    <main className="bg-neutral-01 mx-auto flex min-h-dvh w-full max-w-[430px] flex-col">
      <AppHeader showMenu={false} className="text-neutral-04" />
      <ErrorView
        code="404"
        title="페이지를 찾을 수 없어요"
        description={
          "주소가 바뀌었거나 삭제된 페이지예요.\n홈에서 다시 찾아보세요."
        }
      />
    </main>
  );
};

export default NotFound;
