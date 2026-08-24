"use client";

import { useRef, useState } from "react";

import type { PlaceDetailResponse } from "@/types/place";
import { cn } from "@/lib/cn";
import Button from "@/components/ui/Button";

interface PlaceDetailSheetProps {
  place: PlaceDetailResponse;
  /** 탐험 전/중 — 항상 부모(지도 화면)가 판단해 전달, 컴포넌트 내부에서 추론하지 않음 */
  status: "before" | "during";
  /** status가 "during"일 때만 의미 있음 — 이미 밝힌 장소인지 */
  visited?: boolean;
  onInfoClick?: () => void;
  onReveal?: () => void;
  className?: string;
}

/**
 * 장소 상세 정보 공용 바텀시트 (components/place-detail).
 * 탐험 전/중 화면에서 동일하게 재사용하며, 하단 액션만 status·visited props로 분기한다.
 * 오픈/클로즈 상태는 갖지 않는 순수 표시 컴포넌트로, 마운트 여부는 부모가 결정한다.
 */
const PlaceDetailSheet = ({
  place,
  status,
  visited = false,
  onInfoClick,
  onReveal,
  className,
}: PlaceDetailSheetProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const actionLabel =
    status === "before" ? "정보" : visited ? "밝힘 완료" : "밝히기";
  const handleActionClick = status === "before" ? onInfoClick : onReveal;
  const isActionDisabled = status === "during" && visited;

  // 사진이 없으면 placeholder 한 칸을 보여줄 수 있도록 빈 슬롯 하나를 둔다
  const images = place.images.length > 0 ? place.images : [""];

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
        "bg-neutral-01 flex max-h-[85vh] w-full max-w-[430px] flex-col rounded-t-xl pt-3",
        className,
      )}
    >
      <div className="bg-neutral-03 mx-auto h-1 w-10 shrink-0 rounded-full" />

      <div className="overflow-y-auto pt-3">
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
                className="bg-neutral-03 aspect-video w-full shrink-0 snap-center"
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
          <h2 className="text-neutral-07 mt-4 text-[18px] font-semibold">
            {place.name}
          </h2>
          <p className="text-neutral-04 mt-1 text-[13px]">{place.address}</p>
          {place.operatingHours && (
            <p className="text-neutral-04 mt-1 text-[13px]">
              운영시간 {place.operatingHours}
            </p>
          )}

          {place.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {place.tags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="bg-neutral-02 text-neutral-06 rounded-full px-2.5 py-1 text-[12px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {place.isMemorialSite ? (
            <div className="bg-neutral-02 text-neutral-06 mt-3 rounded-md px-3.5 py-3 text-[13px] leading-relaxed">
              {place.description}
            </div>
          ) : (
            <p className="text-neutral-06 mt-3 text-[14px] leading-relaxed">
              {place.description}
            </p>
          )}
        </div>
      </div>

      <div className="px-5 pt-3 pb-8">
        <Button
          variant="solid"
          size="lg"
          onClick={handleActionClick}
          disabled={isActionDisabled}
          className="w-full"
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
};

export default PlaceDetailSheet;
