import { describe, expect, it } from "vitest";

import { getMockCourse } from "./courseHandlers";

describe("getMockCourse", () => {
  it("요청한 courseId를 그대로 담아 코스를 반환한다", () => {
    expect(getMockCourse(1).courseId).toBe(1);
    expect(getMockCourse(42).courseId).toBe(42);
    expect(getMockCourse(1).places.length).toBeGreaterThan(0);
  });
});
