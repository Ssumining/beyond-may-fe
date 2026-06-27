import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1분간은 재요청 안 함 (신선한 걸로 간주 -> 서버 부담↓, 빠름)
      retry: 1, // 실패 시 1번 재시도
      refetchOnWindowFocus: false, // 창 다시 클릭해도 재요청 안 함 (디버깅 때 헷갈림 방지)
    },
  },
});
