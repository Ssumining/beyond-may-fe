import { useMutation } from "@tanstack/react-query";
import { postVisit } from "@/services/api/exploration/explorationApi";
import type { VisitRequest, VisitResponse } from "@/types/exploration";

/**
 * 방문 인증 요청 mutation.
 * 서버가 좌표·정확도를 재검증하며, 성공 시 방문 기록과 진행률을 반환.
 * 성공/실패 후속 처리(핀 컬러 전환, 토스트)는 호출처에서 onSuccess/onError로 처리.
 */

const useCreateVisitMutation = () =>
  useMutation<VisitResponse, Error, VisitRequest>({
    mutationFn: (body: VisitRequest) => postVisit(body),
  });

export default useCreateVisitMutation;
