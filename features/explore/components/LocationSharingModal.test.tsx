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
import LocationSharingModal from "./LocationSharingModal";
import {
  getExplorationStatus,
  patchLocationSharing,
} from "@/services/api/exploration/explorationApi";
import type { ExplorationStatusResponse } from "@/types/exploration";
import { QUERY_KEYS } from "@/services/constant/queryKey";
import useLocationSharingPromptStore from "@/stores/locationSharingPromptStore";

vi.mock("@/services/api/exploration/explorationApi", () => ({
  getExplorationStatus: vi.fn(),
  patchLocationSharing: vi.fn(),
}));

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
    locationSharingEnabled: true,
  },
  permissions: { canStart: false, canCompleteEarly: true },
};

beforeEach(() => useLocationSharingPromptStore.setState({ dismissed: {} }));
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.resetAllMocks();
});

it.each([
  { label: "이미 공유 중", data: status },
  {
    label: "완료한 탐험",
    data: {
      ...status,
      status: "COMPLETED" as const,
      currentParticipant: {
        ...status.currentParticipant,
        locationSharingEnabled: false,
      },
    },
  },
  {
    label: "시작 전 탐험",
    data: {
      ...status,
      status: "BEFORE" as const,
      currentParticipant: {
        ...status.currentParticipant,
        locationSharingEnabled: false,
      },
    },
  },
  {
    label: "이탈한 참여자",
    data: {
      ...status,
      currentParticipant: {
        ...status.currentParticipant,
        status: "LEFT" as const,
        locationSharingEnabled: false,
      },
    },
  },
])("$label 상태에서는 동의 팝업을 표시하지 않는다", ({ data }) => {
  const client = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity } },
  });
  client.setQueryData(QUERY_KEYS.EXPLORATION.STATUS("99"), data);
  render(
    <QueryClientProvider client={client}>
      <LocationSharingModal explorationId="99" />
    </QueryClientProvider>,
  );
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(patchLocationSharing).not.toHaveBeenCalled();
});

it("동의 저장 실패 시 팝업에서 재시도할 수 있고 성공 후에는 닫힌다", async () => {
  const data = {
    ...status,
    currentParticipant: {
      ...status.currentParticipant,
      locationSharingEnabled: false,
    },
  };
  vi.mocked(getExplorationStatus).mockResolvedValue(data);
  vi.mocked(patchLocationSharing)
    .mockRejectedValueOnce(new Error("저장 실패"))
    .mockImplementationOnce(async () => {
      vi.mocked(getExplorationStatus).mockResolvedValue(status);
      return {
        explorationId: 99,
        participantId: 7,
        locationSharingEnabled: true,
        updatedAt: "2026-09-19T10:00:00+09:00",
      };
    });
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <LocationSharingModal explorationId="99" />
    </QueryClientProvider>,
  );
  fireEvent.click(
    await screen.findByRole("button", { name: "팀과 위치 공유하기" }),
  );
  expect(await screen.findByRole("alert")).toBeInTheDocument();
  expect(useLocationSharingPromptStore.getState().dismissed).toEqual({});
  fireEvent.click(screen.getByRole("button", { name: "팀과 위치 공유하기" }));
  await waitFor(() =>
    expect(useLocationSharingPromptStore.getState().dismissed["99:7"]).toBe(
      true,
    ),
  );
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

it("탐험 상태 조회 중에는 동의 팝업을 표시하지 않는다", () => {
  vi.mocked(getExplorationStatus).mockReturnValue(new Promise(() => {}));
  render(
    <QueryClientProvider client={new QueryClient()}>
      <LocationSharingModal explorationId="99" />
    </QueryClientProvider>,
  );
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

it("나중에를 선택하면 공유를 켜지 않고 재진입해도 다시 묻지 않는다", async () => {
  vi.mocked(getExplorationStatus).mockResolvedValue({
    ...status,
    currentParticipant: {
      ...status.currentParticipant,
      locationSharingEnabled: false,
    },
  });
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  const view = () =>
    render(
      <QueryClientProvider client={client}>
        <LocationSharingModal explorationId="99" />
      </QueryClientProvider>,
    );
  const first = view();
  fireEvent.click(await screen.findByRole("button", { name: "나중에" }));
  first.unmount();
  view();
  await act(async () => {});
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(patchLocationSharing).not.toHaveBeenCalled();
  const saved = localStorage.getItem("location-sharing-prompts");
  cleanup();
  useLocationSharingPromptStore.setState({ dismissed: {} });
  localStorage.setItem("location-sharing-prompts", saved!);
  await useLocationSharingPromptStore.persist.rehydrate();
  view();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  await act(async () => {
    client.setQueryData(QUERY_KEYS.EXPLORATION.STATUS("99"), {
      ...status,
      currentParticipant: {
        ...status.currentParticipant,
        participantId: 8,
        locationSharingEnabled: false,
      },
    });
  });
  expect(await screen.findByRole("dialog")).toBeInTheDocument();
  cleanup();
  client.setQueryData(QUERY_KEYS.EXPLORATION.STATUS("100"), {
    ...status,
    explorationId: 100,
    currentParticipant: {
      ...status.currentParticipant,
      locationSharingEnabled: false,
    },
  });
  render(
    <QueryClientProvider client={client}>
      <LocationSharingModal explorationId="100" />
    </QueryClientProvider>,
  );
  expect(screen.getByRole("dialog")).toBeInTheDocument();
});
