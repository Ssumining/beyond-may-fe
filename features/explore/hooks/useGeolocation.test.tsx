import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import useGeolocation from "./useGeolocation";
import useGeolocationStore from "@/stores/geolocationStore";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  localStorage.clear();
});

it("GPS 사용을 끄면 추적과 기존 좌표를 지우고 늦게 도착한 위치도 무시한다", () => {
  let receive!: PositionCallback;
  const watchPosition = vi.fn((callback: PositionCallback) => {
    receive = callback;
    return 42;
  });
  const clearWatch = vi.fn();
  vi.stubGlobal("navigator", { geolocation: { watchPosition, clearWatch } });
  useGeolocationStore.setState({ isEnabled: true });
  renderHook(() => useGeolocation());
  const position = {
    coords: { latitude: 35, longitude: 126, accuracy: 5 },
  } as GeolocationPosition;
  act(() => receive(position));
  expect(useGeolocationStore.getState().coordinates).not.toBeNull();
  act(() => useGeolocationStore.getState().setEnabled(false));
  expect(clearWatch).toHaveBeenCalledWith(42);
  expect(useGeolocationStore.getState().coordinates).toBeNull();
  act(() => receive(position));
  expect(useGeolocationStore.getState().coordinates).toBeNull();
  act(() => useGeolocationStore.getState().setEnabled(true));
  expect(watchPosition).toHaveBeenCalledTimes(2);
});

it("GPS 끄기를 저장한 뒤 새로고침해도 hydration 중 위치를 요청하지 않는다", () => {
  const watchPosition = vi.fn(() => 42);
  vi.stubGlobal("navigator", {
    geolocation: { watchPosition, clearWatch: vi.fn() },
  });
  useGeolocationStore.getState().setEnabled(false);
  const Probe = () => {
    useGeolocation();
    return null;
  };
  const container = document.createElement("div");
  container.innerHTML = renderToString(<Probe />);
  document.body.appendChild(container);
  render(<Probe />, { container, hydrate: true });
  expect(watchPosition).not.toHaveBeenCalled();
});
