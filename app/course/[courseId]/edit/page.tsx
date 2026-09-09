"use client";

import { use, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import AppHeader from "@/components/layout/AppHeader";
import Button from "@/components/ui/Button";
import CourseTimeline from "@/features/course/components/CourseTimeline";
import useGetPlaceRecommendationsQuery from "@/features/places/hooks/useGetPlaceRecommendationsQuery";
import { getMinimumSelectionCount } from "@/features/places/utils/travelSchedule";
import { useGetCourseDetailQuery } from "@/hooks/queries/useGetCourseDetailQuery";
import {
  postCourseAddPlace,
  postCourseChat,
  postCourseChatApply,
  putCoursePlaces,
} from "@/services/api/course/courseApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";
import type {
  CourseResponse,
  CoursePlace,
  CourseChatRecommendation,
} from "@/types/course";

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
  "이동 거리가 짧게 다듬어줘",
  "점심 장소를 중간에 배치해줘",
  "역사 장소를 먼저 둘러보게 해줘",
];

const NEW_PLACE_DEFAULTS = {
  // TODO(#56 여파): 추천 목록엔 좌표·주소가 없음(PlaceRecommendationResponse).
  // 실제 위치는 장소 상세 조회 연동 후 채워야 함 — 임시로 광주 중심 좌표 사용.
  address: "장소 상세에서 확인",
  latitude: 35.1469,
  longitude: 126.9199,
  estimatedStayMinutes: 60,
  travelModeFromPrevious: null,
} as const;

const CourseEditor = ({ course, initialMode, fromHub }: CourseEditorProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<EditMode>(initialMode);
  const [places, setPlaces] = useState(() =>
    [...course.places].sort((a, b) => a.visitOrder - b.visitOrder),
  );
  const [instruction, setInstruction] = useState("");
  const [chatMessage, setChatMessage] = useState<string | null>(null);
  const [chatRecommendations, setChatRecommendations] = useState<
    CourseChatRecommendation[]
  >([]);
  const [remainingRevisions, setRemainingRevisions] = useState(2);
  const [hasRefinedPreview, setHasRefinedPreview] = useState(false);
  const [history, setHistory] = useState<CoursePlace[][]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [isAddPlaceOpen, setIsAddPlaceOpen] = useState(false);
  const [addPlaceQuery, setAddPlaceQuery] = useState("");
  const [selectedNewPlaceIds, setSelectedNewPlaceIds] = useState<Set<number>>(
    new Set(),
  );
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const { data: recommendations = [] } = useGetPlaceRecommendationsQuery();
  const minimumPlaceCount = getMinimumSelectionCount(course.travelSchedule);
  const availablePlaces = recommendations.filter(
    (place) =>
      !places.some(({ placeId }) => placeId === place.placeId) &&
      (addPlaceQuery.trim() === "" ||
        place.name.includes(addPlaceQuery.trim())),
  );

  // 되돌리기·최소 개수 안내를 하단에 잠깐 띄우는 토스트 (PlaceCardDeck의 담은 장소 토스트와 동일 패턴)
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2000);
    return () => clearTimeout(timer);
  }, [notice]);

  const handleSaveSuccess = (updatedCourse: CourseResponse): void => {
    queryClient.setQueryData(
      QUERY_KEYS.COURSE.DETAIL(String(course.courseId)),
      updatedCourse,
    );
    void queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.COURSE.LIST(),
    });
    router.push(
      `/course/${course.courseId}/detail${fromHub ? "?from=hub" : ""}`,
    );
  };

  const toPlacesPayload = () =>
    places.map((place, index) => ({
      placeId: place.placeId,
      dayNumber: place.dayNumber,
      visitOrder: index + 1,
    }));

  const chatMutation = useMutation({
    mutationFn: () =>
      postCourseChat(String(course.courseId), {
        message: instruction.trim(),
      }),
    onSuccess: (result) => {
      setChatMessage(result.message);
      setRemainingRevisions(result.remainingRevisions);
      if (result.type === "COURSE_REVISION") {
        setPlaces(
          [...result.proposedPlaces].sort(
            (a, b) => a.visitOrder - b.visitOrder,
          ),
        );
        setHasRefinedPreview(true);
        setChatRecommendations([]);
      } else {
        setChatRecommendations(result.recommendations);
        setHasRefinedPreview(false);
      }
    },
  });

  const chatApplyMutation = useMutation({
    mutationFn: () =>
      postCourseChatApply(String(course.courseId), {
        places: toPlacesPayload(),
      }),
    onSuccess: handleSaveSuccess,
  });

  const manualSaveMutation = useMutation({
    mutationFn: () =>
      putCoursePlaces(String(course.courseId), {
        places: toPlacesPayload(),
      }),
    onSuccess: handleSaveSuccess,
  });

  /** 챗봇이 추천한 장소를 즉시 코스에 추가한다(저장까지 바로 반영). */
  const addPlaceMutation = useMutation({
    mutationFn: (placeId: number) =>
      postCourseAddPlace(String(course.courseId), placeId),
    onSuccess: (updatedCourse, placeId) => {
      setPlaces(
        [...updatedCourse.places].sort((a, b) => a.visitOrder - b.visitOrder),
      );
      queryClient.setQueryData(
        QUERY_KEYS.COURSE.DETAIL(String(course.courseId)),
        updatedCourse,
      );
      setChatRecommendations((current) =>
        current.filter((place) => place.placeId !== placeId),
      );
    },
  });

  const activeSaveMutation =
    mode === "ai" ? chatApplyMutation : manualSaveMutation;

  const handleDelete = (index: number): void => {
    if (places.length <= minimumPlaceCount) {
      setNotice(`최소 ${minimumPlaceCount}개 장소가 필요해요`);
      return;
    }
    setHistory((items) => [...items, places]);
    setPlaces((current) =>
      current
        .filter((_, placeIndex) => placeIndex !== index)
        .map((place, placeIndex) => ({ ...place, visitOrder: placeIndex + 1 })),
    );
  };

  const handleUndo = (): void => {
    const previous = history.at(-1);
    if (!previous) {
      setNotice("더 되돌릴 항목이 없어요");
      return;
    }
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

  const toggleNewPlaceSelection = (placeId: number): void => {
    setSelectedNewPlaceIds((current) => {
      const next = new Set(current);
      if (next.has(placeId)) next.delete(placeId);
      else next.add(placeId);
      return next;
    });
  };

  /** 수동 편집: 선택한 추천 장소들을 로컬 상태에만 추가한다 — 최종 저장은 "수정 완료"에서 한 번에. */
  const handleApplyNewPlaces = (): void => {
    const toAdd = recommendations.filter((place) =>
      selectedNewPlaceIds.has(place.placeId),
    );
    if (toAdd.length === 0) return;
    setHistory((items) => [...items, places]);
    setPlaces((current) => [
      ...current,
      ...toAdd.map((recommendation, offset) => ({
        placeId: recommendation.placeId,
        name: recommendation.name,
        category: recommendation.category,
        summary: `${recommendation.category} · ${recommendation.tags[0] ?? "추천 장소"}`,
        dayNumber: current.at(-1)?.dayNumber ?? 1,
        visitOrder: current.length + offset + 1,
        ...NEW_PLACE_DEFAULTS,
      })),
    ]);
    setSelectedNewPlaceIds(new Set());
    setAddPlaceQuery("");
    setIsAddPlaceOpen(false);
  };

  if (isAddPlaceOpen) {
    return (
      <main className="bg-neutral-01 mx-auto flex h-dvh w-full max-w-[430px] flex-col">
        <header className="flex items-center gap-3 px-4 pt-4 pb-2">
          <button
            type="button"
            aria-label="닫기"
            onClick={() => setIsAddPlaceOpen(false)}
            className="focus-visible:outline-primary-03 flex h-9 w-9 items-center justify-center rounded-full text-[18px] focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            ←
          </button>
          <h1 className="text-neutral-07 flex-1 text-center text-[15px] font-semibold">
            장소 추가
          </h1>
          <span className="w-9" aria-hidden="true" />
        </header>

        <div className="px-6 pt-2">
          <div className="border-neutral-03 flex min-h-12 items-center gap-2 rounded-full border bg-white px-4">
            <span className="text-neutral-04 text-[14px]" aria-hidden="true">
              ⌕
            </span>
            <input
              value={addPlaceQuery}
              onChange={(event) => setAddPlaceQuery(event.target.value)}
              placeholder="장소를 검색해보세요."
              className="text-neutral-07 placeholder:text-neutral-04 flex-1 text-[14px] outline-none"
            />
          </div>
          <p className="text-neutral-04 mt-2 text-[11px]">
            이미 코스에 담긴 장소는 목록에서 제외됩니다
          </p>
        </div>

        <ul className="mt-3 flex-1 space-y-2 overflow-y-auto px-6 pb-4">
          {availablePlaces.length === 0 ? (
            <li className="text-neutral-04 py-10 text-center text-[13px]">
              추가할 수 있는 장소가 없어요.
            </li>
          ) : (
            availablePlaces.map((place) => {
              const isSelected = selectedNewPlaceIds.has(place.placeId);
              return (
                <li key={place.placeId}>
                  <button
                    type="button"
                    onClick={() => toggleNewPlaceSelection(place.placeId)}
                    aria-pressed={isSelected}
                    className="border-neutral-03 flex min-h-16 w-full items-center gap-3 rounded-[18px] border bg-white px-3 py-2 text-left"
                  >
                    <span
                      className="bg-neutral-03 h-11 w-11 shrink-0 rounded-xl"
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-neutral-07 truncate text-[14px] font-semibold">
                        {place.name}
                      </p>
                      <p className="text-neutral-04 mt-0.5 truncate text-[11px]">
                        {place.category}
                        {place.tags[0] ? ` · ${place.tags[0]}` : ""}
                      </p>
                    </div>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] ${
                        isSelected
                          ? "bg-neutral-07 text-neutral-01"
                          : "border-neutral-03 text-neutral-04 border"
                      }`}
                    >
                      {isSelected ? "✓" : "+"}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>

        <div className="border-neutral-03 border-t bg-white px-6 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
          <Button
            variant="solid"
            size="lg"
            className="w-full"
            disabled={selectedNewPlaceIds.size === 0}
            onClick={handleApplyNewPlaces}
          >
            {selectedNewPlaceIds.size}곳 추가 / 코스에 반영
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-neutral-01 mx-auto flex h-dvh w-full max-w-[430px] flex-col">
      <AppHeader
        backHref={`/course/${course.courseId}/detail${fromHub ? "?from=hub" : ""}`}
        showMenu={false}
        centerLabel={mode === "manual" ? "순서 편집" : "코스 수정"}
      />

      <div className="border-neutral-03 mx-6 mt-4 grid grid-cols-2 rounded-full border bg-white p-1">
        {(["ai", "manual"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            aria-pressed={mode === value}
            className={`min-h-10 rounded-full px-3 text-[13px] font-semibold transition-colors ${
              mode === value
                ? "bg-neutral-07 text-neutral-01"
                : "text-neutral-04"
            }`}
          >
            {value === "ai" ? "AI로 다듬기" : "직접 수정"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pb-5">
        {mode === "ai" ? (
          <>
            <section className="px-6 pt-7 pb-6">
              <p className="text-primary-08 text-[12px] font-semibold tracking-[0.12em]">
                AI ROUTE EDITOR
              </p>
              <h1 className="text-neutral-07 mt-2 text-[26px] leading-[1.35] font-bold">
                어떻게 바꾸고 싶나요?
              </h1>
              <p className="text-neutral-04 mt-2 text-[13px] leading-[1.55]">
                원하는 이동 방식이나 장소 순서를 말해 주세요. ·{" "}
                {remainingRevisions}/2회 남음
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setInstruction(suggestion)}
                    className="border-neutral-03 text-neutral-06 focus-visible:outline-primary-03 min-h-9 rounded-full border bg-white px-3 text-[12px]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <label
                htmlFor="course-instruction"
                className="text-neutral-07 mt-5 block text-[13px] font-semibold"
              >
                수정 요청
              </label>
              <textarea
                id="course-instruction"
                value={instruction}
                onChange={(event) => setInstruction(event.target.value)}
                maxLength={150}
                rows={3}
                placeholder="예: 걷는 거리가 짧도록 순서를 바꿔줘"
                className="border-neutral-03 text-neutral-07 placeholder:text-neutral-04 focus:border-primary-08 mt-2 w-full resize-none rounded-[18px] border bg-white px-4 py-3 text-[14px] outline-none"
              />
              <p className="text-neutral-04 mt-1 text-right text-[11px] tabular-nums">
                {instruction.length} / 150
              </p>

              <Button
                variant="solid"
                size="lg"
                className="mt-3 w-full"
                disabled={!instruction.trim() || remainingRevisions <= 0}
                isLoading={chatMutation.isPending}
                onClick={() => chatMutation.mutate()}
              >
                {chatMutation.isPending ? "코스 다듬는 중" : "새 순서 제안받기"}
              </Button>

              {(hasRefinedPreview || chatRecommendations.length > 0) &&
                chatMessage && (
                  <p
                    className="bg-primary-04 text-primary-08 mt-3 rounded-xl px-4 py-3 text-[12px] font-medium"
                    role="status"
                  >
                    {chatMessage}
                  </p>
                )}
              {chatMutation.isError && (
                <div
                  className="bg-caution-01 text-caution-02 mt-3 rounded-xl px-4 py-3 text-[12px]"
                  role="alert"
                >
                  코스를 다듬지 못했어요. 요청을 바꾸거나 다시 시도해 주세요.
                </div>
              )}
              {remainingRevisions <= 0 && !hasRefinedPreview && (
                <div className="bg-neutral-02 text-neutral-06 mt-3 rounded-xl px-4 py-3 text-[12px]">
                  AI 수정 2회를 모두 사용했어요.
                  <button
                    type="button"
                    onClick={() => setMode("manual")}
                    className="text-primary-08 ml-1 font-semibold underline underline-offset-2"
                  >
                    직접 수정하기
                  </button>
                </div>
              )}
            </section>

            {chatRecommendations.length > 0 && (
              <section className="px-6 pb-6" aria-labelledby="ai-recs-title">
                <h2
                  id="ai-recs-title"
                  className="text-neutral-07 text-[14px] font-semibold"
                >
                  추천 장소
                </h2>
                <ul className="mt-3 space-y-2">
                  {chatRecommendations.map((place) => (
                    <li
                      key={place.placeId}
                      className="border-neutral-03 rounded-[18px] border bg-white p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-neutral-07 truncate text-[14px] font-semibold">
                            {place.name}
                          </p>
                          <p className="text-neutral-04 mt-0.5 text-[11px]">
                            {place.category}
                          </p>
                          <p className="text-neutral-06 mt-1 text-[12px] leading-[1.5]">
                            {place.reason}
                          </p>
                        </div>
                        <Button
                          size="md"
                          className="shrink-0"
                          isLoading={
                            addPlaceMutation.isPending &&
                            addPlaceMutation.variables === place.placeId
                          }
                          onClick={() => addPlaceMutation.mutate(place.placeId)}
                        >
                          추가
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {hasRefinedPreview && (
              <section aria-labelledby="ai-preview-title">
                <h2
                  id="ai-preview-title"
                  className="text-neutral-07 px-6 pb-3 text-[14px] font-semibold"
                >
                  코스 미리보기 · {places.length}곳
                </h2>
                <CourseTimeline places={places} />
              </section>
            )}
          </>
        ) : (
          <section className="px-6 pt-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-neutral-07 text-[14px] font-semibold">
                장소 순서 · {places.length}곳
              </h2>
              <button
                type="button"
                onClick={handleUndo}
                disabled={history.length === 0}
                className="border-neutral-03 text-neutral-06 disabled:text-neutral-03 min-h-9 rounded-full border px-3 text-[12px]"
              >
                ↺ 되돌리기
              </button>
            </div>
            <p className="text-neutral-04 mt-1 text-[12px]">
              항목을 끌어서 순서를 바꿀 수 있어요.
            </p>

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
                  <span
                    className="text-neutral-04 cursor-grab px-1 text-[16px]"
                    aria-hidden="true"
                  >
                    ≡
                  </span>
                  <span
                    className="bg-neutral-03 h-11 w-11 shrink-0 rounded-xl"
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-neutral-07 truncate text-[14px] font-semibold">
                      {place.name}
                    </p>
                    <p className="text-neutral-04 mt-0.5 truncate text-[11px]">
                      {place.summary}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`${place.name} 코스에서 삭제`}
                    onClick={() => handleDelete(index)}
                    className="border-neutral-03 text-neutral-06 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[14px]"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ol>

            <button
              type="button"
              onClick={() => setIsAddPlaceOpen(true)}
              className="border-neutral-03 text-neutral-04 mt-2 flex min-h-16 w-full items-center justify-center rounded-[18px] border border-dashed bg-white text-[13px] font-medium"
            >
              + 장소 추가
            </button>
          </section>
        )}
      </div>

      <div className="border-neutral-03 border-t bg-white px-6 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
        {notice && (
          <p
            className="bg-neutral-07 text-neutral-01 mx-auto mb-3 w-fit rounded-full px-4 py-2 text-[12px]"
            role="status"
          >
            {notice}
          </p>
        )}
        {mode === "ai" && !hasRefinedPreview ? (
          <p className="text-neutral-04 py-3 text-center text-[12px]">
            {chatRecommendations.length > 0
              ? "장소를 추가하면 바로 코스에 반영돼요."
              : "수정 요청을 보내면 원래 코스와 비교할 수 있어요."}
          </p>
        ) : (
          <>
            <Button
              variant="solid"
              size="lg"
              className="w-full"
              disabled={places.length < minimumPlaceCount}
              isLoading={activeSaveMutation.isPending}
              onClick={() => activeSaveMutation.mutate()}
            >
              {activeSaveMutation.isPending
                ? "저장 중"
                : mode === "ai"
                  ? "이 코스로 변경"
                  : "수정 완료"}
            </Button>
            {mode === "ai" && (
              <Button
                size="lg"
                className="mt-2 w-full"
                onClick={() =>
                  router.push(
                    `/course/${course.courseId}/detail${fromHub ? "?from=hub" : ""}`,
                  )
                }
              >
                원래 코스 유지
              </Button>
            )}
          </>
        )}
        {activeSaveMutation.isError && (
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
};

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
