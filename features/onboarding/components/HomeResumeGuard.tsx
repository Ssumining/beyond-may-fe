"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { getCourses } from "@/services/api/course/courseApi";
import { getExplorations } from "@/services/api/exploration/explorationApi";
import { QUERY_KEYS } from "@/services/constant/queryKey";
import useSessionStore from "@/stores/sessionStore";

/** 일반 홈 방문에서만 서버 상태를 새로 확인해 여행을 이어간다. */
export default function HomeResumeGuard() {
  const router = useRouter();
  const setExplorationId = useSessionStore((state) => state.setExplorationId);
  const [dismissed, setDismissed] = useState(false);
  const navigated = useRef(false);
  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: QUERY_KEYS.HOME.RESUME(),
    queryFn: async () => {
      // 조회 사이에 BEFORE → ONGOING으로 바뀌어도 두 목록에서 모두 놓치지 않게 한다.
      const [before, courses] = await Promise.all([
        getExplorations("BEFORE"),
        getCourses(),
      ]);
      const ongoing = await getExplorations("ONGOING");
      return {
        ongoing: ongoing.explorations[0],
        before: before.explorations[0],
        draft: courses.courses.find((course) => course.status === "DRAFT"),
      };
    },
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isFetching || isError || !data || dismissed || navigated.current)
      return;
    if (data.ongoing) {
      navigated.current = true;
      setExplorationId(data.ongoing.explorationId);
      router.replace("/explore/" + data.ongoing.courseId + "/map");
    } else if (!data.before && !data.draft) {
      navigated.current = true;
      router.replace("/places");
    }
  }, [data, isFetching, isError, dismissed, router, setExplorationId]);

  if (dismissed) return null;
  if (isFetching || !data || isError) {
    return (
      <Modal open onClose={() => {}}>
        <p
          role={isError && !isFetching ? "alert" : "status"}
          className="text-neutral-07 text-center"
        >
          {isFetching
            ? "여행 상태를 확인하고 있어요."
            : "여행 상태를 불러오지 못했어요. 다시 시도해 주세요."}
        </p>
        {isError && !isFetching && (
          <Button className="mt-5 w-full" onClick={() => void refetch()}>
            다시 시도
          </Button>
        )}
      </Modal>
    );
  }
  if (data.ongoing || (!data.before && !data.draft)) return null;

  const before = data.before;
  return (
    <Modal open onClose={() => setDismissed(true)}>
      <h2 className="text-neutral-07 text-center text-lg font-semibold">
        {before
          ? "이미 만들어진 코스가 있어요. 해당 코스로 이동할까요?"
          : "만들던 코스가 있어요. 이어서 만들까요?"}
      </h2>
      <div className="mt-5 flex flex-col gap-3">
        <Button
          variant="solid"
          onClick={() => {
            if (before) setExplorationId(before.explorationId);
            navigated.current = true;
            setDismissed(true);
            router.replace(
              "/course/" + (before?.courseId ?? data.draft!.courseId),
            );
          }}
        >
          {before ? "네" : "이어서 만들기"}
        </Button>
        <Button
          onClick={() => {
            setDismissed(true);
            if (!before) router.replace("/places");
          }}
        >
          {before ? "아니요" : "새로 만들기"}
        </Button>
      </div>
    </Modal>
  );
}
