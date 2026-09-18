import { Suspense } from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import RecordPage from "./page";
import SidebarProfileMenu from "@/components/layout/sidebar/SidebarProfileMenu";
import { getExplorations } from "@/services/api/exploration/explorationApi";
import useSessionStore from "@/stores/sessionStore";
import type { ExplorationSummary } from "@/types/exploration";

vi.mock("@/components/layout/AppHeader", () => ({ default: () => null }));
vi.mock("@/features/onboarding/hooks/useGetMyPreferenceQuery", () => ({
  default: () => ({ data: undefined }),
}));
vi.mock("@/services/api/exploration/explorationApi", () => ({
  getExplorations: vi.fn(),
}));
vi.mock("@/services/api/record/recordApi", () => ({
  getTeamVisits: async () => ({ visits: [] }),
}));

const ongoing: ExplorationSummary = {
  explorationId: 99,
  courseId: 11,
  courseTitle: "진행 중 코스",
  status: "ONGOING",
  representativeImageUrl: null,
  participantCount: 1,
  participantDisplayNames: ["테스트"],
  completedCoursePlaceCount: 1,
  totalCoursePlaceCount: 3,
  startedAt: "2026-09-19T09:00:00+09:00",
  completedAt: null,
};

beforeEach(() => {
  vi.resetAllMocks();
  useSessionStore.getState().clearSession();
});
afterEach(() => {
  cleanup();
  localStorage.clear();
});

it("사이드바 여행 기록은 진행 중 탭으로 연결된다", () => {
  useSessionStore.getState().setSession("테스트", 1);
  render(<SidebarProfileMenu />);
  expect(screen.getByRole("link", { name: "여행 기록" })).toHaveAttribute(
    "href",
    "/record?tab=ongoing",
  );
});

it.each([
  { loggedIn: true, hasOngoing: true },
  { loggedIn: true, hasOngoing: false },
  { loggedIn: false, hasOngoing: true },
])(
  "완료 탭 버튼은 로그인=$loggedIn, 탐험=$hasOngoing에 맞게 연결된다",
  async ({ loggedIn, hasOngoing }) => {
    if (loggedIn) useSessionStore.getState().setSession("테스트", 1);
    vi.mocked(getExplorations).mockImplementation(async (status) => {
      const explorations = status === "ONGOING" && hasOngoing ? [ongoing] : [];
      return { status, explorations, totalCount: explorations.length };
    });
    await act(async () => {
      render(
        <QueryClientProvider
          client={
            new QueryClient({ defaultOptions: { queries: { retry: false } } })
          }
        >
          <Suspense>
            <RecordPage searchParams={Promise.resolve({ tab: "completed" })} />
          </Suspense>
        </QueryClientProvider>,
      );
    });
    const canResume = loggedIn && hasOngoing;
    const link = await screen.findByRole("link", {
      name: canResume ? "탐험 계속 하기" : "여행 시작하기",
    });
    expect(link).toHaveAttribute(
      "href",
      canResume ? "/explore/11/map" : "/places",
    );
    if (canResume) {
      link.addEventListener("click", (event) => event.preventDefault());
      fireEvent.click(link);
      expect(useSessionStore.getState().explorationId).toBe(99);
    }
  },
);
