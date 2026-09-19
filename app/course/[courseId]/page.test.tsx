import { Suspense, type ComponentProps } from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import CoursePage from "./page";
import CourseSummaryPanel from "@/features/course/components/CourseSummaryPanel";
import { getCourses } from "@/services/api/course/courseApi";
import {
  getExplorationStatus,
  postStart,
} from "@/services/api/exploration/explorationApi";
import useSessionStore from "@/stores/sessionStore";
import type { ExplorationStatus } from "@/types/exploration";

const router = vi.hoisted(() => ({
  push: vi.fn(),
  back: vi.fn(),
  replace: vi.fn(),
}));
vi.mock("next/navigation", () => ({ useRouter: () => router }));
vi.mock("@/hooks/queries/useGetCourseDetailQuery", () => ({
  useGetCourseDetailQuery: () => ({
    data: {
      courseId: 4,
      title: "기존 코스",
      status: "CONFIRMED",
      travelSchedule: "DAY_TRIP",
      places: [],
    },
    refetch: vi.fn(),
  }),
}));
vi.mock("@/services/api/course/courseApi", () => ({
  getCourses: vi.fn(),
  postCourseConfirm: vi.fn(),
}));
vi.mock("@/services/api/exploration/explorationApi", () => ({
  getExplorationStatus: vi.fn(),
  postStart: vi.fn(),
}));
vi.mock("@/features/course/components/CourseMapView", () => ({
  default: (props: ComponentProps<typeof CourseSummaryPanel>) => (
    <CourseSummaryPanel {...props} />
  ),
}));

const setExploration = (
  status: ExplorationStatus,
  participantStatus: "ACTIVE" | "LEFT" = "ACTIVE",
) => {
  vi.mocked(getCourses).mockResolvedValue({
    courses: [
      {
        courseId: 4,
        title: "기존 코스",
        status: "CONFIRMED",
        updatedAt: "2026-09-19T09:00:00+09:00",
        explorationId: 44,
        explorationStatus: status,
      },
    ],
  });
  vi.mocked(getExplorationStatus).mockResolvedValue({
    explorationId: 44,
    courseId: 4,
    status,
    startedByParticipantId: 1,
    startedAt: null,
    completedAt: null,
    participantCount: 1,
    teamVisitedPlaceCount: 0,
    courseProgress: {
      completedCoursePlaceCount: 0,
      totalCoursePlaceCount: 3,
      completionRate: 0,
    },
    currentParticipant: {
      participantId: 1,
      role: "OWNER",
      status: participantStatus,
      locationSharingEnabled: false,
    },
    permissions: {
      canStart: status === "BEFORE",
      canCompleteEarly: status === "ONGOING",
    },
  });
};

beforeEach(() => {
  vi.clearAllMocks();
  useSessionStore.getState().setSession("테스트", 1);
  useSessionStore.getState().setExplorationId(999);
  setExploration("ONGOING");
});
afterEach(() => {
  cleanup();
  useSessionStore.getState().clearSession();
  localStorage.clear();
});

const renderPage = async () => {
  await act(async () => {
    render(
      <QueryClientProvider
        client={
          new QueryClient({ defaultOptions: { queries: { retry: false } } })
        }
      >
        <Suspense>
          <CoursePage
            params={Promise.resolve({ courseId: "4" })}
            searchParams={Promise.resolve({ from: "hub" })}
          />
        </Suspense>
      </QueryClientProvider>,
    );
  });
};

it.each([999, null])(
  "세션 탐험 ID가 %s여도 선택한 진행 중 탐험의 지도로 이어간다",
  async (sessionId) => {
    useSessionStore.setState({ explorationId: sessionId });
    await renderPage();
    fireEvent.click(
      await screen.findByRole("button", { name: "탐험 계속하기" }),
    );
    expect(postStart).not.toHaveBeenCalled();
    expect(router.push).toHaveBeenCalledWith("/explore/4/map");
    expect(useSessionStore.getState().explorationId).toBe(44);
  },
);

it("출발 전 코스는 다른 세션 ID가 아닌 해당 코스의 탐험을 시작한다", async () => {
  setExploration("BEFORE");
  vi.mocked(postStart).mockResolvedValue({
    explorationId: 44,
    courseId: 4,
    status: "ONGOING",
    participantId: 1,
    startedAt: "2026-09-19T09:00:00+09:00",
  });
  await renderPage();
  fireEvent.click(await screen.findByRole("button", { name: "탐험 시작" }));
  fireEvent.click(
    screen.getByRole("button", { name: "권한 없이 코스 미리보기" }),
  );
  await waitFor(() =>
    expect(vi.mocked(postStart).mock.calls[0]?.[0]).toBe("44"),
  );
  await waitFor(() =>
    expect(router.push).toHaveBeenCalledWith("/explore/4/map"),
  );
  expect(useSessionStore.getState().explorationId).toBe(44);
});

it("완료된 코스는 다시 시작하지 않고 여행 기록으로 이동한다", async () => {
  setExploration("COMPLETED");
  await renderPage();
  fireEvent.click(
    await screen.findByRole("button", { name: "여행 기록 보기" }),
  );
  expect(postStart).not.toHaveBeenCalled();
  expect(router.push).toHaveBeenCalledWith("/record?tab=completed");
});

it("탐험 상태 조회가 실패하면 시작을 허용하지 않는다", async () => {
  vi.mocked(getExplorationStatus).mockRejectedValue(new Error("조회 실패"));
  await renderPage();
  expect(
    await screen.findByText("코스를 불러오지 못했어요"),
  ).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "탐험 시작" })).toBeNull();
  expect(postStart).not.toHaveBeenCalled();
});

it("이미 이탈한 참여자는 지도에 바로 들어가지 않고 기존 합류 절차로 이동한다", async () => {
  setExploration("ONGOING", "LEFT");
  await renderPage();
  fireEvent.click(await screen.findByRole("button", { name: "탐험 계속하기" }));
  expect(router.push).toHaveBeenCalledWith("/explore/4");
  expect(postStart).not.toHaveBeenCalled();
});
