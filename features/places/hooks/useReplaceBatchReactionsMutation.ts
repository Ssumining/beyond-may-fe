import { useMutation } from "@tanstack/react-query";

import { postBatchReactions } from "@/services/api/recommendation/recommendationApi";
import type {
  ReplaceBatchReactionsRequest,
  ReplaceBatchReactionsResponse,
} from "@/types/recommendation";

interface ReplaceBatchReactionsVariables {
  recommendationId: number;
  body: ReplaceBatchReactionsRequest;
}

/**
 * 현재 회차 반응 일괄 교체 (POST /recommendations/{id}/reactions).
 * 회차의 마지막 카드를 넘겼을 때 그 회차의 좋아요·싫어요 전체를 한 번에 제출한다.
 */
const useReplaceBatchReactionsMutation = () =>
  useMutation<
    ReplaceBatchReactionsResponse,
    Error,
    ReplaceBatchReactionsVariables
  >({
    mutationFn: ({ recommendationId, body }) =>
      postBatchReactions(recommendationId, body),
  });

export default useReplaceBatchReactionsMutation;
