"use client";

import { use, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import AppHeader from "@/components/layout/AppHeader";
import Button from "@/components/ui/Button";
import CourseTimeline from "@/features/course/components/CourseTimeline";
import useGetPlaceRecommendationsQuery from "@/features/places/hooks/useGetPlaceRecommendationsQuery";
import { getMinimumSelectionCount } from "@/features/places/utils/travelSchedule";
import { moveCoursePlace } from "@/features/course/utils/reorderCoursePlaces";
import { useGetCourseDetailQuery } from "@/hooks/queries/useGetCourseDetailQuery";
import {
  patchCourse,
  postCourseChat,
  postCourseChatApply,
} from "@/services/api/course/courseApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";
import type { CourseResponse, CoursePlace } from "@/types/course";
import AlertCircle from "@/components/ui/icons/AlertCircle";
import ArrowRight from "@/components/ui/icons/ArrowRight";

import KakaoMap from "@/components/map/Map";
import { getCourseMapData } from "@/features/course/utils/courseMapAdapter";
import Sparkle from "@/components/ui/icons/Sparkle";

type EditMode = "ai" | "manual";

interface CourseEditPageProps {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ mode?: string; from?: string }>;
}

interface CourseEditorProps {
  course: CourseResponse;
  initialMode: EditMode;
  fromHub: boolean;
}

const SUGGESTIONS = [
  "야경 명소 넣어줘",
  "카페 한 곳 추가",
  "걷는 거리 줄여줘",
  "실내 위주로",
  "로컬 맛집 추가",
];

const CourseEditor = ({ course, initialMode, fromHub }: CourseEditorProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(course.title);
  const [places, setPlaces] = useState(() =>
    [...course.places].sort((a, b) => a.visitOrder - b.visitOrder),
  );
  const [instruction, setInstruction] = useState("");
  const [proposedPlaces, setProposedPlaces] = useState<CoursePlace[] | null>(
    null,
  );
  const [remainingRevisions, setRemainingRevisions] = useState(2);
  const [history, setHistory] = useState<CoursePlace[][]>([]);
  const [isAddingPlace, setIsAddingPlace] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const { data: recommendations = [] } = useGetPlaceRecommendationsQuery();
  const minimumPlaceCount = getMinimumSelectionCount(course.travelSchedule);
  const availablePlaces = recommendations.filter(
    (place) => !places.some(({ placeId }) => placeId === place.placeId),
  );

  const isAiMode = initialMode === "ai";
  const detailHref = `/course/${course.courseId}/detail${fromHub ? "?from=hub" : ""}`;
  const manualHref = `/course/${course.courseId}/edit?mode=manual${fromHub ? "&from=hub" : ""}`;

  const chatMutation = useMutation({
    mutationFn: () =>
      postCourseChat(String(course.courseId), {
        message: instruction.trim(),
      }),
    onSuccess: (res) => {
      setRemainingRevisions(res.remainingRevisions);
      if (res.type === "COURSE_REVISION") {
        setProposedPlaces(res.proposedPlaces);
      }
    },
  });

  const applyMutation = useMutation({
    mutationFn: () => {
      const target = proposedPlaces ?? places;
      return postCourseChatApply(String(course.courseId), {
        places: target.map((place, index) => ({
          placeId: place.placeId,
          dayNumber: place.dayNumber,
          visitOrder: index + 1,
        })),
      });
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(
        QUERY_KEYS.COURSE.DETAIL(String(course.courseId)),
        updated,
      );
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COURSE.LIST(),
      });
      router.push(detailHref);
    },
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      patchCourse(String(course.courseId), {
        places: places.map((place, index) => ({
          placeId: place.placeId,
          dayNumber: place.dayNumber,
          visitOrder: index + 1,
        })),
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        QUERY_KEYS.COURSE.DETAIL(String(course.courseId)),
        updated,
      );
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COURSE.LIST(),
      });
      router.push(detailHref);
    },
  });

  const hasProposal = proposedPlaces !== null;
  const previewPlaces = proposedPlaces ?? places;
  const addedPlaceIds =
    proposedPlaces
      ?.filter((p) => !places.some((o) => o.placeId === p.placeId))
      .map((p) => p.placeId) ?? [];

  const handleMove = (index: number, direction: -1 | 1) => {
    setPlaces((current) => {
      const next = moveCoursePlace(current, index, direction);
      setHistory((items) => [...items, current]);
      return next;
    });
  };

  const handleDelete = (index: number): void => {
    if (places.length <= minimumPlaceCount) return;
    setHistory((items) => [...items, places]);
    setPlaces((current) =>
      current
        .filter((_, placeIndex) => placeIndex !== index)
        .map((place, placeIndex) => ({ ...place, visitOrder: placeIndex + 1 })),
    );
  };

  const handleUndo = (): void => {
    const previous = history.at(-1);
    if (!previous) return;
    setPlaces(previous);
    setHistory((items) => items.slice(0, -1));
  };

  const handleDrop = (toIndex: number): void => {
    if (dragIndex === null || dragIndex === toIndex) return;
    const next = [...places];
    const [moved] = next.splice(dragIndex, 1);
    if (!moved) return;
    next.splice(toIndex, 0, moved);
    setHistory((items) => [...items, places]);
    setPlaces(
      next.map((place, index) => ({ ...place, visitOrder: index + 1 })),
    );
    setDragIndex(null);
  };

  const handleAddPlace = (placeId: number): void => {
    const recommendation = recommendations.find(
      (place) => place.placeId === placeId,
    );
    if (!recommendation) return;
    setHistory((items) => [...items, places]);
    setPlaces((current) => [
      ...current,
      {
        placeId: recommendation.placeId,
        name: recommendation.name,
        category: recommendation.category,
        summary: `${recommendation.category} · ${recommendation.tags[0] ?? "추천 장소"}`,
        address: "장소 상세에서 확인",
        latitude: 35.1469,
        longitude: 126.9199,
        dayNumber: places.at(-1)?.dayNumber ?? 1,
        visitOrder: current.length + 1,
        estimatedStayMinutes: 60,
        travelModeFromPrevious: null,
      },
    ]);
  };

  // ── 직접 수정(manual) 모드 — 10번에서 3.2.2 디자인으로 재작성 예정 ──
  if (!isAiMode) {
    return (
      <main className="bg-neutral-01 mx-auto flex h-dvh w-full max-w-[430px] flex-col">
        <AppHeader
          backHref={detailHref}
          showMenu={false}
          centerLabel="순서 편집"
        />
        <div className="flex-1 overflow-y-auto px-6 pt-7 pb-5">
          <label
            htmlFor="course-title"
            className="text-neutral-07 block text-[13px] font-semibold"
          >
            코스 이름
          </label>
          <input
            id="course-title"
            value={title}
            maxLength={30}
            onChange={(event) => setTitle(event.target.value)}
            className="border-neutral-03 text-neutral-07 focus:border-primary-08 mt-2 min-h-12 w-full rounded-[16px] border bg-white px-4 text-[14px] outline-none"
          />

          <div className="mt-7 flex items-center justify-between gap-3">
            <h2 className="text-neutral-07 text-[14px] font-semibold">
              장소 순서 · {places.length}곳
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleUndo}
                disabled={history.length === 0}
                className="border-neutral-03 text-neutral-06 disabled:text-neutral-03 min-h-9 rounded-full border px-3 text-[12px]"
              >
                ↺ 되돌리기
              </button>
              <button
                type="button"
                onClick={() => setIsAddingPlace((open) => !open)}
                className="border-neutral-03 text-neutral-06 min-h-9 rounded-full border px-3 text-[12px]"
              >
                + 장소 추가
              </button>
            </div>
          </div>
          <p className="text-neutral-04 mt-1 text-[12px]">
            항목을 끌거나 화살표를 눌러 순서를 바꿀 수 있어요.
          </p>

          {isAddingPlace && (
            <div className="border-neutral-03 mt-3 rounded-[18px] border bg-white p-3">
              <p className="text-neutral-07 text-[13px] font-semibold">
                추천 장소에서 추가
              </p>
              {availablePlaces.length === 0 ? (
                <p className="text-neutral-04 py-5 text-center text-[12px]">
                  더 추가할 추천 장소가 없어요.
                </p>
              ) : (
                <ul className="mt-2 space-y-1">
                  {availablePlaces.map((place) => (
                    <li key={place.placeId}>
                      <button
                        type="button"
                        onClick={() => handleAddPlace(place.placeId)}
                        className="bg-neutral-02 flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-left text-[12px]"
                      >
                        <span className="truncate font-medium">
                          {place.name}
                        </span>
                        <span className="text-primary-08 shrink-0">추가</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <ol className="mt-3 space-y-2">
            {places.map((place, index) => (
              <li
                key={place.placeId}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop(index)}
                className="border-neutral-03 flex min-h-16 items-center gap-3 rounded-[18px] border bg-white px-3 py-2"
              >
                <span className="bg-neutral-07 text-neutral-01 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px]">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-neutral-07 truncate text-[14px] font-semibold">
                    {place.name}
                  </p>
                  <p className="text-neutral-04 mt-0.5 truncate text-[11px]">
                    {place.summary}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <MoveButton
                    place={place}
                    label="위로 이동"
                    disabled={index === 0}
                    onClick={() => handleMove(index, -1)}
                  >
                    ↑
                  </MoveButton>
                  <MoveButton
                    place={place}
                    label="아래로 이동"
                    disabled={index === places.length - 1}
                    onClick={() => handleMove(index, 1)}
                  >
                    ↓
                  </MoveButton>
                  <MoveButton
                    place={place}
                    label="코스에서 삭제"
                    disabled={places.length <= minimumPlaceCount}
                    onClick={() => handleDelete(index)}
                  >
                    ×
                  </MoveButton>
                </div>
              </li>
            ))}
          </ol>
          <p
            className={`mt-4 text-center text-[12px] ${
              places.length <= minimumPlaceCount
                ? "text-caution-02"
                : "text-neutral-04"
            }`}
            role="status"
          >
            이 여행 기간은 최소 {minimumPlaceCount}곳이 필요해요. 최소
            개수에서는 삭제할 수 없습니다.
          </p>
        </div>

        <div className="border-neutral-03 border-t bg-white px-6 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
          <Button
            variant="solid"
            size="lg"
            className="w-full"
            disabled={!title.trim() || places.length < minimumPlaceCount}
            isLoading={saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
          >
            {saveMutation.isPending ? "저장 중" : "수정 완료"}
          </Button>
          {saveMutation.isError && (
            <p
              className="text-caution-02 mt-2 text-center text-[12px]"
              role="alert"
            >
              저장하지 못했어요. 다시 시도해 주세요.
            </p>
          )}
        </div>
      </main>
    );
  }

  // ── AI 수정 모드 (3.2.1) ──
  return (
    <main className="bg-neutral-01 mx-auto flex h-dvh w-full max-w-[430px] flex-col">
      <AppHeader
        backHref={detailHref}
        showMenu={false}
        centerLabel="AI로 코스 다듬기"
      />

      {chatMutation.isPending ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-[22px]">
          <div className="border-neutral-03 border-t-neutral-07 h-11 w-11 animate-spin rounded-full border-[3px]" />
          <div className="flex flex-col items-center gap-2">
            <p className="text-neutral-07 text-[16px] font-medium">
              AI가 코스를 다시 짜고 있어요
            </p>
            <p className="text-neutral-05 text-[12px]">잠시만 기다려 주세요</p>
          </div>
        </div>
      ) : chatMutation.isError ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-[14px] px-10">
          <span className="border-neutral-03 text-neutral-04 flex h-[52px] w-[52px] items-center justify-center rounded-full border-2">
            <AlertCircle className="h-[26px] w-[26px]" />
          </span>
          <p className="text-neutral-07 text-[18px] font-semibold">
            코스를 불러오지 못했어요
          </p>
          <p className="text-neutral-05 -mt-2 text-[13px]">
            잠시 후 다시 시도해 주세요.
          </p>
          <Button
            size="lg"
            className="mt-[18px] w-full"
            onClick={() => chatMutation.reset()}
          >
            다시 시도
          </Button>
        </div>
      ) : remainingRevisions <= 0 && !hasProposal ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-[14px] px-10">
          <span className="border-neutral-03 text-neutral-04 rounded-full border px-[14px] py-[6px] text-[11px] font-medium">
            2 / 2 사용
          </span>
          <p className="text-neutral-07 text-[18px] font-semibold">
            수정 요청을 모두 사용했어요
          </p>
          <p className="text-neutral-05 -mt-2 text-center text-[13px] leading-[22px]">
            이제 직접 수정으로 코스를
            <br />
            원하는 대로 다듬어보세요.
          </p>
          <Button
            variant="solid"
            size="lg"
            className="mt-[18px] w-full"
            onClick={() => router.push(manualHref)}
          >
            직접 수정하기
          </Button>
        </div>
      ) : (
        <>
          {hasProposal && viewMode === "map" ? (
            // 3.2.1-D 지도 뷰
            <div className="relative flex-1">
              <KakaoMap {...getCourseMapData(previewPlaces)} />
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className="bg-neutral-01 border-neutral-03 text-neutral-07 absolute top-20 right-4 z-10 flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12px] font-semibold shadow-sm"
              >
                ≡ 목록
              </button>
              <span className="bg-neutral-07 text-neutral-01 absolute top-20 left-4 z-10 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-semibold">
                <Sparkle className="h-3.5 w-3.5" />
                AI 수정안
              </span>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <section className="px-[30px] pt-9 pb-6">
                <h1 className="text-neutral-07 text-[19px] leading-[30px] font-medium">
                  어떻게 바꿀까요?
                  <br />
                  원하는 방향을 편하게 말해주세요.
                </h1>

                <p className="text-neutral-04 mt-8 text-[11.6px] font-bold tracking-[0.1em]">
                  추천 키워드
                </p>
                <div className="mt-3 flex flex-wrap gap-[6px]">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setInstruction(suggestion)}
                      className="border-neutral-03 text-neutral-04 rounded-full border bg-white px-4 py-[10px] text-[13.5px] font-medium"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>

                <p className="text-neutral-05 mt-9 text-right text-[11px] tabular-nums">
                  {instruction.length} / 150
                </p>
                <div className="border-neutral-07 mt-[6px] flex items-center gap-3 border px-4 py-[18px]">
                  <input
                    value={instruction}
                    onChange={(event) => setInstruction(event.target.value)}
                    maxLength={150}
                    placeholder="내용을 입력해주세요."
                    className="text-neutral-07 placeholder:text-neutral-03 flex-1 text-[15px] outline-none"
                  />
                  <button
                    type="button"
                    aria-label="수정 요청 보내기"
                    disabled={!instruction.trim() || remainingRevisions <= 0}
                    onClick={() => chatMutation.mutate()}
                    className="text-neutral-05 disabled:text-neutral-03 shrink-0"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </section>

              {hasProposal && (
                <section aria-labelledby="ai-preview-title">
                  <h2
                    id="ai-preview-title"
                    className="text-neutral-04 px-[25px] pb-3 text-[10px] font-normal tracking-[1px] uppercase"
                  >
                    수정된 코스 · {previewPlaces.length}곳
                  </h2>
                  <CourseTimeline
                    places={previewPlaces}
                    addedPlaceIds={addedPlaceIds}
                  />
                  <button
                    type="button"
                    onClick={() => setViewMode("map")}
                    className="text-neutral-04 mt-2 w-full py-2 text-center text-[13.4px] font-semibold"
                  >
                    지도로 보기
                  </button>
                </section>
              )}
            </div>
          )}

          {hasProposal && (
            <div className="border-neutral-03 border-t bg-white px-6 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={() => setProposedPlaces(null)}
                >
                  원래 코스 유지
                </Button>
                <Button
                  variant="solid"
                  size="lg"
                  className="flex-1"
                  isLoading={applyMutation.isPending}
                  onClick={() => applyMutation.mutate()}
                >
                  {applyMutation.isPending ? "변경 중" : "이 코스로 변경"}
                </Button>
              </div>
              {applyMutation.isError && (
                <p
                  className="text-caution-02 mt-2 text-center text-[12px]"
                  role="alert"
                >
                  저장하지 못했어요. 다시 시도해 주세요.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
};

interface MoveButtonProps {
  place: CoursePlace;
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: string;
}

const MoveButton = ({
  place,
  label,
  disabled,
  onClick,
  children,
}: MoveButtonProps) => (
  <button
    type="button"
    aria-label={`${place.name} ${label}`}
    disabled={disabled}
    onClick={onClick}
    className="border-neutral-03 text-neutral-07 disabled:text-neutral-03 disabled:bg-neutral-02 flex h-9 w-9 items-center justify-center rounded-full border text-[16px]"
  >
    {children}
  </button>
);

const CourseEditPage = ({ params, searchParams }: CourseEditPageProps) => {
  const { courseId } = use(params);
  const { mode, from } = use(searchParams);
  const fromHub = from === "hub";
  const {
    data: course,
    isLoading,
    isError,
    refetch,
  } = useGetCourseDetailQuery(courseId);

  if (isLoading) {
    return (
      <main className="bg-neutral-01 mx-auto flex min-h-dvh w-full max-w-[430px] flex-col">
        <AppHeader
          backHref={`/course/${courseId}/detail${fromHub ? "?from=hub" : ""}`}
          showMenu={false}
          centerLabel="코스 수정"
        />
        <div className="space-y-3 px-6 pt-8" role="status">
          <div className="bg-neutral-03 h-10 animate-pulse rounded-full" />
          <div className="bg-neutral-02 h-40 animate-pulse rounded-[20px]" />
          <div className="bg-neutral-02 h-16 animate-pulse rounded-[20px]" />
        </div>
      </main>
    );
  }

  if (isError || !course) {
    return (
      <main className="bg-neutral-01 mx-auto flex min-h-dvh w-full max-w-[430px] flex-col">
        <AppHeader
          backHref={`/course/${courseId}/detail${fromHub ? "?from=hub" : ""}`}
          showMenu={false}
          centerLabel="코스 수정"
        />
        <section className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <h1 className="text-neutral-07 text-[20px] font-semibold">
            수정할 코스를 불러오지 못했어요
          </h1>
          <Button
            variant="solid"
            size="lg"
            className="mt-5 w-full"
            onClick={() => void refetch()}
          >
            다시 불러오기
          </Button>
        </section>
      </main>
    );
  }

  return (
    <CourseEditor
      key={course.courseId}
      course={course}
      initialMode={mode === "manual" ? "manual" : "ai"}
      fromHub={fromHub}
    />
  );
};

export default CourseEditPage;
