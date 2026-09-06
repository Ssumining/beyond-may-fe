import { forwardRef } from "react";
import { format } from "date-fns";

import { cn } from "@/lib/cn";
import type {
  PreferenceResultResponse,
  PreferenceType,
} from "@/types/preference";
import {
  getResultTheme,
  PREFERENCE_TYPE_LABEL,
} from "@/features/onboarding/utils/resultTheme";
import StampPhoto from "@/features/onboarding/components/StampPhoto";

interface ShareRecordCardProps {
  result: PreferenceResultResponse;
  className?: string;
}

/** 기록 카드에 담을 추천 장소 개수 */
const RECORD_PLACE_COUNT = 5;

/**
 * 결과 공유 "화면 그대로(기록형)" 카드 — 버전 1 (이슈 #29).
 *
 * 유형별 그라디언트 배경 위에 우표 모양(사방 톱니)으로 오린 대표 사진을
 * 기울여 배치하고, 그 옆에 유형명·태그·설명·4유형 비율·추천 장소를
 * 이어 붙여 하나의 이미지로 온전히 담는다. SNS 피드·기록용.
 */
const ShareRecordCard = forwardRef<HTMLDivElement, ShareRecordCardProps>(
  ({ result, className }, ref) => {
    const {
      type,
      mbtiName,
      mbtiTag,
      mbtiImg,
      mbtiDescription,
      percentages,
      recommendedPlaces,
    } = result;
    const theme = getResultTheme(type);
    // 지금은 "오늘" 날짜 도장이라 new Date()로 충분하다.
    // TODO: 실제 방문 날짜(REST에서 오는 ISO 문자열)를 표시하게 되면
    // new Date(isoString) 대신 date-fns parseISO를 써야 한다.
    const stampDate = format(new Date(), "yyyy.MM.dd");
    const places = recommendedPlaces.slice(0, RECORD_PLACE_COUNT);

    // 예술러/미식러처럼 배경이 밝은 톤이면 글자를 어둡게(neutral-07), 아니면 밝게(neutral-01).
    const text = theme.isLight ? "text-neutral-07" : "text-neutral-01";
    const text90 = theme.isLight ? "text-neutral-07/90" : "text-neutral-01/90";
    const text70 = theme.isLight ? "text-neutral-07/70" : "text-neutral-01/70";
    const text60 = theme.isLight ? "text-neutral-07/60" : "text-neutral-01/60";
    const border70 = theme.isLight
      ? "border-neutral-07/70"
      : "border-neutral-01/70";
    const borderDivider = theme.isLight
      ? "border-neutral-07/25"
      : "border-neutral-01/25";

    return (
      <div
        ref={ref}
        className={cn("w-full px-6 pt-8 pb-7", className)}
        style={{
          background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
        }}
      >
        {/* 우표 사진 + 유형명 */}
        <div className="flex items-end gap-4">
          <div className="relative aspect-3/4 w-[38%] shrink-0">
            <StampPhoto
              src={mbtiImg || theme.image}
              alt={mbtiName}
              className="-rotate-6"
            />
            <div className="border-neutral-01 absolute -top-3 -right-4 flex h-11 w-11 -rotate-13 flex-col items-center justify-center rounded-full border-2">
              <span className="text-neutral-01 text-[8px] leading-none font-bold">
                光州
              </span>
              <span className="text-neutral-05 mt-0.5 text-[6px] leading-none font-normal">
                {stampDate}
              </span>
            </div>
          </div>

          <div className="pb-2 text-left">
            <p className={cn(text, "text-[16px] font-medium")}>나는</p>
            <h1 className={cn(text, "text-[30px] leading-tight font-bold")}>
              {mbtiName}
            </h1>
          </div>
        </div>

        {/* 키워드 칩 */}
        <div className="mt-4 flex flex-wrap gap-2">
          {mbtiTag.map((tag) => (
            <span
              key={tag}
              className={cn(
                border70,
                text,
                "rounded-3xl border px-3 py-1 text-[11px] font-medium",
              )}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 설명 */}
        <p className={cn(text90, "mt-3 text-[13px] leading-relaxed")}>
          {mbtiDescription}
        </p>

        {/* 4유형 비율 */}
        <div className="mt-5 flex flex-col gap-1.5">
          {(Object.keys(PREFERENCE_TYPE_LABEL) as PreferenceType[]).map(
            (key) => (
              <div key={key} className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-11 shrink-0 text-[11px]",
                    key === type ? cn(text, "font-semibold") : text60,
                  )}
                >
                  {PREFERENCE_TYPE_LABEL[key]}
                </span>
                <div className="bg-neutral-01/25 h-1.5 flex-1 overflow-hidden rounded-full">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      key === type ? "bg-neutral-01" : "bg-neutral-01/40",
                    )}
                    style={{ width: `${percentages[key]}%` }}
                  />
                </div>
                <span
                  className={cn(text60, "w-8 shrink-0 text-right text-[11px]")}
                >
                  {percentages[key]}%
                </span>
              </div>
            ),
          )}
        </div>

        {/* 추천 장소 목록 */}
        <div className={cn(borderDivider, "mt-5 border-t pt-4")}>
          <h2 className={cn(text, "text-[15px] font-semibold")}>
            {mbtiName}를 위한 광주
          </h2>
          <ul className="mt-3 flex flex-col gap-3">
            {places.map((place, index) => (
              <li key={place.placeId} className="flex items-center gap-3">
                <span className="bg-neutral-01 text-neutral-07 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
                  {index + 1}
                </span>
                <span className={cn(text, "truncate text-[13px] font-medium")}>
                  {place.placeName}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p
          className={cn(text70, "mt-6 text-center text-[10px] tracking-widest")}
        >
          GWANGJU · BEYOND MAY
        </p>
      </div>
    );
  },
);

ShareRecordCard.displayName = "ShareRecordCard";

export default ShareRecordCard;
