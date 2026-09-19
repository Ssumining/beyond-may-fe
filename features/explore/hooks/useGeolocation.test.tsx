import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import useGeolocation from "./useGeolocation";
import useGeolocationStore from "@/stores/geolocationStore";

vi.hoisted(() => {
  localStorage.setItem(
    "location-settings",
    JSON.stringify({ state: { isEnabled: false }, version: 0 }),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  localStorage.clear();
  useGeolocationStore.getState().reset();
});

it("이전에 저장한 GPS 꺼짐 설정이 있어도 탐험 위치 요청을 막지 않는다", () => {
  const watchPosition = vi.fn(() => 42);
  vi.stubGlobal("navigator", {
    geolocation: { watchPosition, clearWatch: vi.fn() },
  });
  renderHook(() => useGeolocation());
  expect(watchPosition).toHaveBeenCalledTimes(1);
});

it("지도에서 나가면 위치 추적을 중단하고 늦게 도착한 좌표를 무시한다", () => {
  let receive!: PositionCallback;
  const watchPosition = vi.fn((callback: PositionCallback) => {
    receive = callback;
    return 42;
  });
  const clearWatch = vi.fn();
  vi.stubGlobal("navigator", { geolocation: { watchPosition, clearWatch } });
  const hook = renderHook(() => useGeolocation());
  hook.unmount();
  expect(clearWatch).toHaveBeenCalledWith(42);
  act(() =>
    receive({
      coords: { latitude: 35, longitude: 126, accuracy: 5 },
    } as GeolocationPosition),
  );
  expect(useGeolocationStore.getState().coordinates).toBeNull();
});
