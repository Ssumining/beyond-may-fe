import { describe, it, expect } from "vitest";

import {
  getMinimumSelectionCount,
  getCalculatedEndDate,
  isValidTravelPeriod,
} from "./travelSchedule";

describe("getMinimumSelectionCount", () => {
  it("일정별 최소 선택 개수", () => {
    expect(getMinimumSelectionCount("DAY_TRIP")).toBe(3);
    expect(getMinimumSelectionCount("ONE_NIGHT_TWO_DAYS")).toBe(5);
    expect(getMinimumSelectionCount("TWO_NIGHTS_THREE_DAYS")).toBe(7);
    expect(getMinimumSelectionCount("CUSTOM")).toBe(20);
  });
});

describe("getCalculatedEndDate", () => {
  it("당일치기는 시작일과 같은 날", () => {
    expect(getCalculatedEndDate("DAY_TRIP", "2026-09-20", "")).toBe("2026-09-20");
  });
  it("1박 2일은 시작일 +1일", () => {
    expect(getCalculatedEndDate("ONE_NIGHT_TWO_DAYS", "2026-09-20", "")).toBe(
      "2026-09-21",
    );
  });
  it("CUSTOM(그 이상)은 현재 종료일 유지", () => {
    expect(getCalculatedEndDate("CUSTOM", "2026-09-20", "2026-09-30")).toBe(
      "2026-09-30",
    );
  });
});

describe("isValidTravelPeriod", () => {
  const today = "2026-09-20";
  it("당일치기: 시작=종료면 유효", () => {
    expect(isValidTravelPeriod("DAY_TRIP", "2026-09-21", "2026-09-21", today)).toBe(
      true,
    );
  });
  it("1박 2일: 정확히 1일 차이만 유효", () => {
    expect(
      isValidTravelPeriod("ONE_NIGHT_TWO_DAYS", "2026-09-21", "2026-09-22", today),
    ).toBe(true);
    expect(
      isValidTravelPeriod("ONE_NIGHT_TWO_DAYS", "2026-09-21", "2026-09-23", today),
    ).toBe(false);
  });
  it("과거 시작일은 무효", () => {
    expect(isValidTravelPeriod("DAY_TRIP", "2026-09-19", "2026-09-19", today)).toBe(
      false,
    );
  });
  it("CUSTOM은 3일 이상 차이면 유효", () => {
    expect(isValidTravelPeriod("CUSTOM", "2026-09-21", "2026-09-24", today)).toBe(
      true,
    );
    expect(isValidTravelPeriod("CUSTOM", "2026-09-21", "2026-09-23", today)).toBe(
      false,
    );
  });
});
