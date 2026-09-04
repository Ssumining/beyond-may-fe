"use client";

import { type ReactNode, useRef, useState } from "react";

import type { PlaceDetailResponse } from "@/types/place";
import { cn } from "@/lib/cn";

interface PlaceDetailSheetProps {
  place: PlaceDetailResponse;
  /**
   * 하단 액션 영역. 화면마다 버튼 모양이 달라(2.2.4: 꽉 찬 "밝히기" Button,
   * 4.4.2: 닫기·좋아요 원형 아이콘 버튼) 컴포넌트가 직접 렌더링하지 않고
   * 호출하는 화면이 원하는 버튼을 그대로 전달한다.
   */
  footer?: ReactNode;
  /** 사진 영역 비율(Tailwind aspect-* 클래스). 화면마다 사진 높이가 달라 조절 가능하게 둠. 기본 aspect-video */
  imageAspectRatio?: string;
  className?: string;
}

/**
 * 장소 상세 정보 공용 바텀시트 (components/place-detail).
 * 사진 캐러셀과 이름·주소·운영시간·태그·설명 표시를 담당하는 공통 구조만 갖고,
 * 하단 액션은 footer prop으로 화면마다 다르게 구성한다.
 * 오픈/클로즈 상태는 갖지 않는 순수 표시 컴포넌트로, 마운트 여부는 부모가 결정한다.
 */
const PlaceDetailSheet = ({
  place,
  footer,
  imageAspectRatio = "aspect-video",
  className,
}: PlaceDetailSheetProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // 실제 API는 thumbnailUrl 1장만 내려주지만, 추후 여러 장 지원 시 그대로
  // 확장할 수 있도록 캐러셀 구조는 유지하고 배열 하나로 감싼다
  const images = [place.thumbnailUrl ?? ""];

  const handleCarouselScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    setActiveImageIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div
      role="dialog"
      aria-label={place.name}
      className={cn(
        "bg-neutral-01 shadow-soft flex max-h-[85vh] w-full max-w-[430px] flex-col rounded-t-2xl pt-3",
        className,
      )}
    >
      <div className="bg-neutral-03 mx-auto h-1 w-10 shrink-0 rounded-full" />

      <div className="flex-1 overflow-y-auto pt-3">
        {/* 장소 사진 배너 — 가로로 꽉 차게, 여러 장이면 옆으로 스와이프 */}
        <div className="relative">
          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto"
          >
            {images.map((imageUrl, index) => (
              <div
                key={index}
                className={cn(
                  "bg-neutral-03 w-full shrink-0 snap-center",
                  imageAspectRatio,
                )}
              >
                {imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={`${place.name} 사진 ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full bg-white",
                    index === activeImageIndex ? "opacity-100" : "opacity-40",
                  )}
                />
              ))}
            </div>
          )}
        </div>

        <div className="px-5">
          <h2 className="text-neutral-07 mt-4 text-lg font-semibold">
            {place.name}
          </h2>
          <p className="text-neutral-04 mt-1 text-sm">{place.address}</p>
          {place.businessHours && (
            <p className="text-neutral-04 mt-1 text-sm">
              운영시간 {place.businessHours}
            </p>
          )}

          {place.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {place.tags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="bg-neutral-02 text-neutral-06 rounded-full px-2.5 py-1 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <p className="text-neutral-06 mt-3 text-sm leading-relaxed">
            {place.description}
          </p>
        </div>
      </div>

      {footer && <div className="px-5 pt-3 pb-8">{footer}</div>}
    </div>
  );
};

export default PlaceDetailSheet;
