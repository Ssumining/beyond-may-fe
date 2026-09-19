import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HomeResumeGuard from "./HomeResumeGuard";
import { getCourses } from "@/services/api/course/courseApi";
import { getExplorations } from "@/services/api/exploration/explorationApi";
import useSessionStore from "@/stores/sessionStore";
import type { CourseSummary } from "@/types/course";
import type { ExplorationSummary } from "@/types/exploration";

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));
vi.mock("@/services/api/course/courseApi", () => ({ getCourses: vi.fn() }));
vi.mock("@/services/api/exploration/explorationApi", () => ({
  getExplorations: vi.fn(),
}));
const draft: CourseSummary = {
  courseId: 7,
  title: "초안",
  status: "DRAFT",
  updatedAt: "2026-09-19T10:00:00+09:00",
  explorationId: null,
  explorationStatus: null,
};
const trip = (status: "BEFORE" | "ONGOING"): ExplorationSummary => ({
  explorationId: 99,
  courseId: 11,
  courseTitle: "함께 걷기",
  status,
  representativeImageUrl: null,
  participantCount: 1,
  participantDisplayNames: [],
  completedCoursePlaceCount: 0,
  totalCoursePlaceCount: 3,
  startedAt: null,
  completedAt: null,
});
function setup() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <HomeResumeGuard />
    </QueryClientProvider>,
  );
}
beforeEach(() => {
  vi.resetAllMocks();
  useSessionStore.getState().clearSession();
  vi.mocked(getCourses).mockResolvedValue({ courses: [] });
  vi.mocked(getExplorations).mockImplementation(async (status) => ({
    status,
    explorations: [],
    totalCount: 0,
  }));
});
afterEach(cleanup);

describe("홈 여행 복구", () => {
  it("조회 도중 팀원이 탐험을 시작해도 코스 없음으로 이동하지 않는다", async () => {
    let serverStatus: "BEFORE" | "ONGOING" = "BEFORE";
    vi.mocked(getExplorations).mockImplementation(async (status) => {
      const explorations = status === serverStatus ? [trip(serverStatus)] : [];
      serverStatus = "ONGOING";
      return { status, explorations, totalCount: explorations.length };
    });
    setup();
    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith("/explore/11/map"),
    );
    expect(replace).not.toHaveBeenCalledWith("/places");
  });
  it("조회 실패 시 이동하지 않고 재시도 성공 후 날짜 선택으로 이동한다", async () => {
    vi.mocked(getCourses).mockRejectedValueOnce(new Error("조회 실패"));
    setup();
    fireEvent.click(await screen.findByRole("button", { name: "다시 시도" }));
    expect(replace).not.toHaveBeenCalled();
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/places"));
  });
  it("내 코스가 없어도 참여 중인 탐험의 ID를 복구하고 지도로 이동한다", async () => {
    vi.mocked(getExplorations).mockImplementation(async (status) => ({
      status,
      explorations: status === "ONGOING" ? [trip(status)] : [],
      totalCount: status === "ONGOING" ? 1 : 0,
    }));
    setup();
    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith("/explore/11/map"),
    );
    expect(useSessionStore.getState().explorationId).toBe(99);
  });
  it.each(["네", "아니요"])(
    "시작 전 탐험 팝업에서 %s를 선택한다",
    async (answer) => {
      vi.mocked(getCourses).mockResolvedValue({ courses: [draft] });
      vi.mocked(getExplorations).mockImplementation(async (status) => ({
        status,
        explorations: status === "BEFORE" ? [trip(status)] : [],
        totalCount: status === "BEFORE" ? 1 : 0,
      }));
      setup();
      fireEvent.click(await screen.findByRole("button", { name: answer }));
      if (answer === "네") {
        expect(replace).toHaveBeenCalledWith("/course/11");
        expect(useSessionStore.getState().explorationId).toBe(99);
      } else {
        await waitFor(() =>
          expect(
            screen.queryByText(
              "이미 만들어진 코스가 있어요. 해당 코스로 이동할까요?",
            ),
          ).not.toBeInTheDocument(),
        );
        expect(replace).not.toHaveBeenCalled();
      }
    },
  );
  it.each(["이어서 만들기", "새로 만들기"])(
    "최신 초안을 제안하고 %s 선택을 반영한다",
    async (answer) => {
      vi.mocked(getCourses).mockResolvedValue({
        courses: [draft, { ...draft, courseId: 6 }],
      });
      setup();
      fireEvent.click(await screen.findByRole("button", { name: answer }));
      expect(replace).toHaveBeenCalledWith(
        answer === "이어서 만들기" ? "/course/7" : "/places",
      );
    },
  );
  it("완료된 탐험만 있으면 날짜 선택으로 이동한다", async () => {
    vi.mocked(getCourses).mockResolvedValue({
      courses: [
        {
          ...draft,
          status: "CONFIRMED",
          explorationStatus: "COMPLETED",
          explorationId: 99,
        },
      ],
    });
    setup();
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/places"));
  });
});
