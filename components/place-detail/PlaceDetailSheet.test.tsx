import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import PlaceDetailSheet from "./PlaceDetailSheet";
import type { PlaceDetailResponse } from "@/types/place";

afterEach(cleanup);

const createPlace = (description: string | null): PlaceDetailResponse =>
  // 서버 계약과 달리 null이 들어오는 응답도 화면에서 안전하게 처리한다.
  JSON.parse(
    JSON.stringify({
      placeId: 1,
      name: "광주공원",
      category: "공원",
      travelMbtiType: "THINKER",
      tags: [],
      address: "광주광역시",
      latitude: 35.1,
      longitude: 126.8,
      businessHours: null,
      description,
      thumbnailUrl: null,
    }),
  );

it.each([null, ""])("설명이 %j이면 안내 문구를 표시한다", (description) => {
  render(<PlaceDetailSheet place={createPlace(description)} />);
  expect(screen.getByText("상세 설명 정보 없음")).toBeInTheDocument();
  expect(screen.getByText("운영시간 정보 없음")).toBeInTheDocument();
});

it("설명과 운영시간의 br 태그를 줄바꿈으로 표시한다", () => {
  const place = createPlace("첫 줄<br>둘째 줄<BR />셋째 줄");
  place.businessHours = "평일 09:00<br/>주말 10:00";
  render(<PlaceDetailSheet place={place} />);
  expect(screen.getByText(/첫 줄/).textContent).toBe("첫 줄\n둘째 줄\n셋째 줄");
  expect(screen.getByText(/운영시간 평일/).textContent).toBe(
    "운영시간 평일 09:00\n주말 10:00",
  );
});

it("상단 닫기 버튼으로 장소 상세를 닫는다", () => {
  const onClose = vi.fn();
  render(
    <PlaceDetailSheet place={createPlace("장소 설명")} onClose={onClose} />,
  );
  fireEvent.click(screen.getByRole("button", { name: "장소 상세 닫기" }));
  expect(onClose).toHaveBeenCalledOnce();
});
