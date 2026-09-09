"use client";

import { use, type ChangeEvent, useState } from "react";
import Link from "next/link";

import AppHeader from "@/components/layout/AppHeader";
import KakaoMap from "@/components/map/Map";
import PlaceDetailSheet from "@/components/place-detail/PlaceDetailSheet";
import Button from "@/components/ui/Button";
import ChevronRight from "@/components/ui/icons/ChevronRight";
import useGetVisitedPlacesQuery from "@/features/record/hooks/useGetVisitedPlacesQuery";
import useUploadVisitPhotoMutation from "@/features/record/hooks/useUploadVisitPhotoMutation";
import { cn } from "@/lib/cn";
import {
  formatRecordDate,
  formatRecordTime,
  MOCK_TRAVEL_RECORDS,
} from "@/features/record/mockRecords";
import type { MapMarker } from "@/types/map";
import type { PlaceDetailResponse } from "@/types/place";
import type { VisitedPlaceRecord } from "@/types/record";

type RecordTab = "ongoing" | "completed" | "visits" | "map";

interface RecordPageProps {
  searchParams: Promise<{ state?: string; tab?: string }>;
}

const TABS: { id: RecordTab; label: string }[] = [
  { id: "ongoing", label: "진행 중" },
  { id: "completed", label: "완료" },
  { id: "visits", label: "방문 장소" },
  { id: "map", label: "밝힌 지도" },
];

const VISIT_COORDINATES = [
  { lat: 35.1469, lng: 126.9199 },
  { lat: 35.1376, lng: 126.9142 },
  { lat: 35.1489, lng: 126.9152 },
  { lat: 35.1402, lng: 126.9088 },
  { lat: 35.1468, lng: 126.9 },
];

const RecordPage = ({ searchParams }: RecordPageProps) => {
  const { state, tab } = use(searchParams);
  const activeTab: RecordTab = TABS.some(({ id }) => id === tab)
    ? (tab as RecordTab)
    : "ongoing";
  const isEmpty = state === "empty";
  const records = isEmpty ? [] : MOCK_TRAVEL_RECORDS;
  const [selectedVisitId, setSelectedVisitId] = useState<number | null>(null);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const {
    data: visitedPlacesData,
    isLoading: isVisitsLoading,
    isError: isVisitsError,
  } = useGetVisitedPlacesQuery();
  const visits = isEmpty
    ? []
    : [...(visitedPlacesData?.visits ?? [])].sort(
        (first, second) =>
          new Date(second.visitedAt).getTime() -
          new Date(first.visitedAt).getTime(),
      );
  // 캐시에서 다시 찾아 파생 — 사진 업로드 후에도 최신 photoUrl을 그대로 반영한다
  const selectedVisit =
    visits.find((visit) => visit.visitId === selectedVisitId) ?? null;
  const mapMarkers: MapMarker[] = visits.slice(0, 5).map((place, index) => ({
    id: String(place.placeId),
    position: VISIT_COORDINATES[index] ?? VISIT_COORDINATES[0],
    visited: true,
    label: place.name,
    order: index + 1,
  }));
  const selectedPlaceDetail: PlaceDetailResponse | null = selectedVisit
    ? {
        placeId: selectedVisit.placeId,
        name: selectedVisit.name,
        category: selectedVisit.category,
        travelMbtiType: "remember",
        tags: selectedVisit.tags,
        address: "광주광역시",
        latitude: 35.1469,
        longitude: 126.9199,
        businessHours: null,
        description: "",
        thumbnailUrl: selectedVisit.photoUrl ?? selectedVisit.thumbnailUrl,
      }
    : null;

  const stateSuffix = isEmpty ? "&state=empty" : "";

  return (
    <main className="bg-neutral-01 mx-auto min-h-dvh w-full max-w-[430px] pb-[max(40px,env(safe-area-inset-bottom))]">
      <AppHeader showMenu={false} centerLabel="여행 기록" />

      <section className="px-6 pt-6 pb-5">
        <p className="text-primary-08 text-[12px] font-semibold tracking-[0.1em]">
          MY JOURNEY
        </p>
        <h1 className="text-neutral-07 mt-2 text-[28px] leading-[1.2] font-bold tracking-[-0.04em]">
          걸었던 광주를
          <br />
          다시 펼쳐보세요
        </h1>
      </section>

      <nav
        aria-label="여행 기록 분류"
        className="scrollbar-hide border-neutral-03 sticky top-0 z-20 flex overflow-x-auto border-y bg-white/95 px-4 backdrop-blur"
      >
        {TABS.map(({ id, label }) => (
          <Link
            key={id}
            href={`/record?tab=${id}${stateSuffix}`}
            aria-current={activeTab === id ? "page" : undefined}
            className={`relative flex min-h-13 shrink-0 items-center px-3 text-[13px] font-semibold ${
              activeTab === id ? "text-neutral-07" : "text-neutral-04"
            }`}
          >
            {label}
            {activeTab === id && (
              <span className="bg-primary-08 absolute inset-x-3 bottom-0 h-0.5 rounded-full" />
            )}
          </Link>
        ))}
      </nav>

      {activeTab === "ongoing" && (
        <section className="px-6 pt-6">
          <SectionHeading title="진행 중인 코스" count={isEmpty ? 0 : 1} />
          {isEmpty ? (
            <EmptyRecordState
              title="아직 탐험 중인 코스가 없습니다"
              description="새 코스를 만들거나 초대받은 코스에서 탐험을 시작해 보세요."
              action="새 코스 만들기"
              href="/places"
            />
          ) : (
            <Link
              href="/explore/course_01J?stage=ongoing"
              className="border-neutral-03 mt-4 block overflow-hidden rounded-[24px] border bg-white p-5 shadow-[0_8px_28px_rgba(20,20,20,0.06)]"
            >
              <div className="flex items-center justify-between">
                <span className="bg-primary-04 text-primary-08 rounded-full px-3 py-1.5 text-[11px] font-semibold">
                  탐험 중
                </span>
                <ChevronRight className="text-neutral-04 h-4 w-4" />
              </div>
              <h2 className="text-neutral-07 mt-5 text-[21px] font-bold">
                하루치 광주
              </h2>
              <p className="text-neutral-04 mt-2 text-[13px]">
                2 / 5 장소 방문 · 팀원 4명
              </p>
              <div className="bg-neutral-02 mt-4 h-2 overflow-hidden rounded-full">
                <div className="bg-primary-08 h-full w-2/5 rounded-full" />
              </div>
              <p className="text-primary-08 mt-4 text-[12px] font-semibold">
                탐험 지도로 돌아가기
              </p>
            </Link>
          )}
        </section>
      )}

      {activeTab === "completed" && (
        <section className="px-6 pt-6">
          <SectionHeading title="완료한 코스" count={records.length} />
          {records.length === 0 ? (
            <EmptyRecordState
              title="아직 완료한 코스가 없습니다"
              description="팀과 함께 코스의 장소를 밝히면 이곳에 평생 보관돼요."
              action="여행 시작하기"
              href="/places"
            />
          ) : (
            <div className="mt-4 space-y-4">
              {records.map((record, index) => (
                <Link
                  key={record.recordId}
                  href={`/record/${record.explorationId}`}
                  className="border-neutral-03 block overflow-hidden rounded-[24px] border bg-white shadow-[0_8px_28px_rgba(20,20,20,0.06)]"
                >
                  <div
                    className={`relative h-28 overflow-hidden ${
                      index === 0
                        ? "bg-[linear-gradient(145deg,#BFBaff_0%,#fce9e3_58%,#ffb274_100%)]"
                        : "bg-[linear-gradient(145deg,#b7caff_0%,#efebfc_55%,#ecf4a2_120%)]"
                    }`}
                  >
                    <span className="absolute top-4 left-4 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-semibold">
                      완주
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-neutral-04 text-[12px]">
                      {formatRecordDate(record.completedAt)}
                    </p>
                    <div className="mt-1 flex items-center gap-3">
                      <h2 className="min-w-0 flex-1 truncate text-[20px] font-bold">
                        {record.title}
                      </h2>
                      <ChevronRight className="text-neutral-04 h-4 w-4" />
                    </div>
                    <p className="text-neutral-04 mt-2 text-[12px]">
                      {record.companionNames.join(" · ")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === "visits" && (
        <section className="px-6 pt-6">
          <SectionHeading title="내가 방문한 장소" count={visits.length} />
          {isVisitsLoading && (
            <p
              className="text-neutral-04 py-10 text-center text-[13px]"
              role="status"
            >
              방문 장소를 불러오고 있어요…
            </p>
          )}

          {isVisitsError && (
            <p
              className="text-caution-02 py-10 text-center text-[13px]"
              role="alert"
            >
              방문 장소를 불러오지 못했어요.
            </p>
          )}

          {!isVisitsLoading && !isVisitsError && visits.length === 0 && (
            <EmptyRecordState
              title="아직 방문한 장소가 없습니다"
              description="장소에서 방문을 인증하면 시간순으로 기록돼요."
              action="진행 중 코스 보기"
              href="/record?tab=ongoing"
            />
          )}

          {!isVisitsLoading && !isVisitsError && visits.length > 0 && (
            <ul className="mt-4 space-y-2">
              {visits.map((place) => (
                <li key={place.visitId}>
                  <button
                    type="button"
                    onClick={() => setSelectedVisitId(place.visitId)}
                    className="border-neutral-03 flex min-h-18 w-full items-center gap-3 rounded-[18px] border bg-white p-3 text-left"
                  >
                    {(place.photoUrl ?? place.thumbnailUrl) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={place.photoUrl ?? place.thumbnailUrl ?? undefined}
                        alt=""
                        aria-hidden="true"
                        className="h-12 w-12 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <span
                        className="bg-primary-04 h-12 w-12 shrink-0 rounded-xl"
                        aria-hidden="true"
                      />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="text-neutral-07 block truncate text-[14px] font-semibold">
                        {place.name}
                      </span>
                      <span className="text-neutral-04 mt-1 block text-[11px]">
                        {formatRecordDate(place.visitedAt)} ·{" "}
                        {formatRecordTime(place.visitedAt)}
                      </span>
                    </span>
                    {place.tags[0] && (
                      <span className="bg-neutral-02 text-neutral-05 shrink-0 rounded-full px-2 py-1 text-[10px]">
                        {place.tags[0]}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {activeTab === "map" && (
        <section className="px-6 pt-6">
          <SectionHeading title="광주에서 밝힌 곳" count={mapMarkers.length} />
          <div className="border-neutral-03 bg-neutral-07 relative mt-4 h-[52dvh] min-h-96 overflow-hidden rounded-[24px] border">
            {mapMarkers.length > 0 && (
              <KakaoMap
                center={{ lat: 35.1469, lng: 126.9142 }}
                markers={mapMarkers}
                route={[]}
                glow
              />
            )}
            {mapMarkers.length === 0 && (
              <div className="bg-neutral-07/90 absolute inset-0 z-10 flex flex-col items-center justify-center px-8 text-center">
                <p className="text-[20px] font-semibold text-white">
                  아직 밝힌 곳이 없어요
                </p>
                <p className="mt-2 text-[13px] leading-[1.55] text-white/60">
                  방문 인증한 장소가 생기면 어두운 지도 위에 빛이 쌓여요.
                </p>
              </div>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button
              size="lg"
              disabled={mapMarkers.length === 0}
              onClick={() =>
                setShareStatus("밝힌 지도 이미지를 저장할 준비가 됐어요.")
              }
            >
              이미지 저장
            </Button>
            <Button
              variant="solid"
              size="lg"
              disabled={mapMarkers.length === 0}
              onClick={() => {
                if (navigator.share) {
                  void navigator.share({
                    title: "내가 밝힌 광주",
                    text: `${mapMarkers.length}곳에 빛을 남겼어요.`,
                    url: window.location.href,
                  });
                } else {
                  void navigator.clipboard?.writeText(window.location.href);
                  setShareStatus("공유 링크를 복사했어요.");
                }
              }}
            >
              지도 공유
            </Button>
          </div>
          {shareStatus && (
            <p
              className="bg-neutral-07 text-neutral-01 mt-3 rounded-full px-4 py-3 text-center text-[12px]"
              role="status"
            >
              {shareStatus}
            </p>
          )}
        </section>
      )}

      {selectedPlaceDetail && selectedVisit && (
        <div className="fixed inset-0 z-50">
          <div
            className="bg-neutral-07/35 absolute inset-0"
            onClick={() => setSelectedVisitId(null)}
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[430px]">
            <PlaceDetailSheet
              place={selectedPlaceDetail}
              onClose={() => setSelectedVisitId(null)}
              footer={
                <VisitPhotoUploadFooter
                  visit={selectedVisit}
                  onDone={() => setSelectedVisitId(null)}
                />
              }
            />
          </div>
        </div>
      )}
    </main>
  );
};

const SectionHeading = ({ title, count }: { title: string; count: number }) => (
  <div className="flex items-end justify-between">
    <h2 className="text-neutral-07 text-[18px] font-bold">{title}</h2>
    <p className="text-neutral-04 text-[12px]">{count}개</p>
  </div>
);

interface EmptyRecordStateProps {
  title: string;
  description: string;
  action: string;
  href: string;
}

const EmptyRecordState = ({
  title,
  description,
  action,
  href,
}: EmptyRecordStateProps) => (
  <div className="flex flex-col items-center py-20 text-center">
    <div className="border-primary-08 bg-primary-04 text-primary-08 flex h-16 w-14 -rotate-3 items-center justify-center border-4 border-dashed text-[16px] font-bold">
      光州
    </div>
    <h2 className="text-neutral-07 mt-6 text-[20px] font-bold">{title}</h2>
    <p className="text-neutral-04 mt-2 text-[13px] leading-[1.6]">
      {description}
    </p>
    <Link
      href={href}
      className="bg-neutral-07 text-neutral-01 mt-6 flex min-h-12 w-full items-center justify-center rounded-full px-5 text-[14px] font-semibold"
    >
      {action}
    </Link>
  </div>
);

interface VisitPhotoUploadFooterProps {
  visit: VisitedPlaceRecord;
  onDone: () => void;
}

const VisitPhotoUploadFooter = ({
  visit,
  onDone,
}: VisitPhotoUploadFooterProps) => {
  const { mutate, isPending, isError } = useUploadVisitPhotoMutation();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    mutate({ visitId: visit.visitId, photo: file });
  };

  return (
    <div className="flex flex-col gap-2">
      {isError && (
        <p className="text-caution-02 text-center text-[12px]" role="alert">
          사진을 업로드하지 못했어요. 다시 시도해 주세요.
        </p>
      )}
      <label
        className={cn(
          "bg-neutral-07 text-neutral-01 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-[15px] font-medium",
          isPending && "pointer-events-none opacity-50",
        )}
      >
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          disabled={isPending}
          onChange={handleFileChange}
        />
        {isPending && (
          <span
            aria-hidden="true"
            className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        )}
        {visit.photoUrl ? "인증 사진 다시 올리기" : "인증 사진 업로드"}
      </label>
      <Button size="lg" className="w-full" onClick={onDone}>
        기록으로 돌아가기
      </Button>
    </div>
  );
};

export default RecordPage;
