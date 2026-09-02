"use client";

import { use, useEffect } from "react";
import { useGetCourseDetailQuery } from "@/hooks/queries/useGetCourseDetailQuery";
import useJoinMutation from "@/features/explore/hooks/useJoinMutation";
import useSessionStore from "@/stores/sessionStore";

interface ExplorePageProps {
  params: Promise<{ courseId: string }>;
}

/**
 * 공유 링크 팀 합류 진입 (4.1.1).
 * courseId로 코스를 조회하고, 세션이 있으면 자동 합류한다.
 * TODO: 합류 성공 시 explorationId 저장 + 탐험 전 코스 보기(4.2.1) 이동
 * TODO: 세션 없을 때 신규(닉네임)·기존(로그인) 합류 흐름
 * TODO: 오류 처리 (유효하지 않은 코스 404 / 만료 410 / 중복 참여 409)
 */
const ExplorePage = ({ params }: ExplorePageProps) => {
  const { courseId } = use(params);
  const isLoggedIn = useSessionStore((state) => state.isLoggedIn);

  const {
    data: course,
    isPending,
    isError,
  } = useGetCourseDetailQuery(courseId);
  const { mutate: join } = useJoinMutation();

  // 코스 조회 성공 + 세션 있으면 자동 합류
  useEffect(() => {
    if (course && isLoggedIn) {
      join(courseId);
      // TODO: onSuccess에서 explorationId 저장 + 4.2.1 이동
    }
  }, [course, isLoggedIn, courseId, join]);

  if (isPending) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <p className="text-neutral-04 text-sm">코스를 불러오고 있어요…</p>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <p className="text-neutral-04 text-sm">코스를 불러오지 못했어요.</p>
      </div>
    );
  }

  // TODO: 탐험 화면(4.2.1) 조립 시 실제 화면으로 교체
  return (
    <div className="flex h-dvh items-center justify-center">
      <p className="text-neutral-04 text-sm">탐험에 합류하고 있어요…</p>
    </div>
  );
};

export default ExplorePage;
