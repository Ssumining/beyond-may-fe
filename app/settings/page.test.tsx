import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import SettingsPage from "./page";
import {
  getExplorations,
  getExplorationStatus,
  patchLocationSharing,
} from "@/services/api/exploration/explorationApi";
import useSessionStore from "@/stores/sessionStore";
import useGeolocationStore from "@/stores/geolocationStore";
import useLocationSharingPromptStore from "@/stores/locationSharingPromptStore";
import type {
  ExplorationStatusResponse,
  ExplorationSummary,
  LocationSharingResponse,
} from "@/types/exploration";

vi.mock("@/features/onboarding/hooks/useGetMyPreferenceQuery", () => ({
  default: () => ({ data: undefined }),
}));
vi.mock("@/services/api/exploration/explorationApi", () => ({
  getExplorations: vi.fn(),
  getExplorationStatus: vi.fn(),
  patchLocationSharing: vi.fn(),
}));

const ongoing: ExplorationSummary = {
  explorationId: 99,
  courseId: 11,
  courseTitle: "진행 중인 탐험",
  status: "ONGOING",
  representativeImageUrl: null,
  participantCount: 1,
  participantDisplayNames: [],
  completedCoursePlaceCount: 0,
  totalCoursePlaceCount: 3,
  startedAt: null,
  completedAt: null,
};
const status: ExplorationStatusResponse = {
  explorationId: 99,
  courseId: 11,
  status: "ONGOING",
  startedByParticipantId: 7,
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
    participantId: 7,
    role: "OWNER",
    status: "ACTIVE",
    locationSharingEnabled: false,
  },
  permissions: { canStart: false, canCompleteEarly: true },
};
beforeEach(() => {
  vi.resetAllMocks();
  useGeolocationStore.setState({ isEnabled: true });
  useLocationSharingPromptStore.setState({ dismissed: {} });
  useSessionStore.getState().setSession("테스트", 1234);
  useSessionStore.getState().setExplorationId(999);
  useSessionStore.getState().setPreferenceType("ARTIST");
  vi.mocked(getExplorations).mockResolvedValue({
    status: "ONGOING",
    explorations: [ongoing],
    totalCount: 1,
  });
  vi.mocked(getExplorationStatus).mockResolvedValue(status);
});
afterEach(() => {
  cleanup();
  useSessionStore.getState().clearSession();
  localStorage.clear();
});

const renderPage = () =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
          },
        })
      }
    >
      <SettingsPage />
    </QueryClientProvider>,
  );

it("설정에서 서버의 현재 탐험에 위치 공유를 켜고 끈다", async () => {
  vi.mocked(patchLocationSharing).mockImplementation(
    async (id, { enabled }) => {
      vi.mocked(getExplorationStatus).mockResolvedValue({
        ...status,
        currentParticipant: {
          ...status.currentParticipant,
          locationSharingEnabled: enabled,
        },
      });
      return {
        explorationId: Number(id),
        participantId: 7,
        locationSharingEnabled: enabled,
        updatedAt: "2026-09-19T10:00:00+09:00",
      };
    },
  );
  renderPage();
  const toggle = await screen.findByRole("switch", {
    name: "팀과 내 위치 공유",
  });
  await waitFor(() => expect(toggle).toHaveAttribute("aria-disabled", "false"));
  expect(toggle).not.toBeChecked();
  fireEvent.click(toggle);
  await waitFor(() => expect(toggle).toBeChecked());
  await waitFor(() => expect(toggle).toHaveAttribute("aria-disabled", "false"));
  expect(patchLocationSharing).toHaveBeenLastCalledWith("99", {
    enabled: true,
  });
  fireEvent.click(toggle);
  await waitFor(() => expect(toggle).not.toBeChecked());
  expect(patchLocationSharing).toHaveBeenLastCalledWith("99", {
    enabled: false,
  });
});

it("저장에 실패하면 기존 공유 상태를 유지하고 오류를 안내한다", async () => {
  vi.mocked(patchLocationSharing).mockRejectedValue(new Error("저장 실패"));
  renderPage();
  const toggle = await screen.findByRole("switch", {
    name: "팀과 내 위치 공유",
  });
  await waitFor(() => expect(toggle).toHaveAttribute("aria-disabled", "false"));
  fireEvent.click(toggle);
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "저장하지 못했어요",
  );
  expect(toggle).not.toBeChecked();
  expect(toggle).toHaveAttribute("aria-disabled", "false");
});

it("진행 중 탐험이 없으면 공유 토글을 비활성화하고 클릭할 때 안내한다", async () => {
  vi.mocked(getExplorations).mockResolvedValue({
    status: "ONGOING",
    explorations: [],
    totalCount: 0,
  });
  renderPage();
  const toggle = await screen.findByRole("switch", {
    name: "팀과 내 위치 공유",
  });
  await waitFor(() => expect(toggle).toHaveAttribute("aria-disabled", "true"));
  await waitFor(() =>
    expect(toggle).toHaveAccessibleDescription(
      "탐험을 시작하면 위치 공유를 설정할 수 있어요.",
    ),
  );
  expect(
    screen.queryByText("탐험을 시작하면 위치 공유를 설정할 수 있어요."),
  ).not.toBeVisible();
  fireEvent.click(toggle);
  expect(screen.getByRole("status")).toHaveTextContent(
    "탐험을 시작하면 위치 공유를 설정할 수 있어요.",
  );
  expect(toggle).not.toBeChecked();
  expect(patchLocationSharing).not.toHaveBeenCalled();
  expect(getExplorationStatus).not.toHaveBeenCalled();
});

it("비로그인 사용자는 개인 정보를 보거나 탐험 설정을 조회하지 않는다", () => {
  useSessionStore.getState().clearSession();
  renderPage();
  expect(
    screen.getByText("로그인하면 설정을 변경할 수 있어요."),
  ).toBeInTheDocument();
  expect(getExplorations).not.toHaveBeenCalled();
  expect(screen.queryByRole("switch")).not.toBeInTheDocument();
});

it("공유 끄기 저장 중 페이지를 떠나도 성공한 선택을 기억한다", async () => {
  vi.mocked(getExplorationStatus).mockResolvedValue({
    ...status,
    currentParticipant: {
      ...status.currentParticipant,
      locationSharingEnabled: true,
    },
  });
  let completeSave!: (value: LocationSharingResponse) => void;
  vi.mocked(patchLocationSharing).mockReturnValue(
    new Promise((resolve) => {
      completeSave = resolve;
    }),
  );
  const page = renderPage();
  const toggle = await screen.findByRole("switch", {
    name: "팀과 내 위치 공유",
  });
  await waitFor(() => expect(toggle).toHaveAttribute("aria-disabled", "false"));
  fireEvent.click(toggle);
  await waitFor(() => expect(patchLocationSharing).toHaveBeenCalled());
  page.unmount();
  completeSave({
    explorationId: 99,
    participantId: 7,
    locationSharingEnabled: false,
    updatedAt: "2026-09-19T10:00:00+09:00",
  });
  await waitFor(() =>
    expect(useLocationSharingPromptStore.getState().dismissed["99:7"]).toBe(
      true,
    ),
  );
});

it("GPS 설정은 탐험 없이도 변경할 수 있고 브라우저에 선택을 보관한다", async () => {
  vi.mocked(getExplorations).mockResolvedValue({
    status: "ONGOING",
    explorations: [],
    totalCount: 0,
  });
  renderPage();
  const toggle = screen.getByRole("switch", { name: "GPS 위치 사용" });
  fireEvent.click(toggle);
  expect(toggle).not.toBeChecked();
  expect(useGeolocationStore.getState().isEnabled).toBe(false);
  expect(JSON.parse(localStorage.getItem("location-settings")!).state).toEqual({
    isEnabled: false,
  });
  fireEvent.click(toggle);
  expect(toggle).toBeChecked();
  expect(patchLocationSharing).not.toHaveBeenCalled();
});
