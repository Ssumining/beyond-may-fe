import { describe, expect, it } from "vitest";

import { moveCoursePlace } from "./reorderCoursePlaces";
import type { CoursePlace } from "@/types/course";

const createPlace = (placeId: number, visitOrder: number): CoursePlace => ({
  placeId,
  visitOrder,
  name: String(placeId),
  category: "문화",
  address: "광주",
  latitude: 35.1,
  longitude: 126.9,
  dayNumber: 1,
  estimatedStayMinutes: 60,
  travelModeFromPrevious: null,
});

describe("moveCoursePlace", () => {
  it("장소를 한 칸 이동하고 순서를 다시 매긴다", () => {
    const result = moveCoursePlace(
      [createPlace(1, 1), createPlace(2, 2), createPlace(3, 3)],
      1,
      1,
    );

    expect(
      result.map(({ placeId, visitOrder }) => [placeId, visitOrder]),
    ).toEqual([
      [1, 1],
      [3, 2],
      [2, 3],
    ]);
  });
});
