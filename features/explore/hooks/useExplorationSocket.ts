import { useEffect, useRef } from "react";
import type { IMessage } from "@stomp/stompjs";
import { connectClient, disconnectClient } from "@/lib/socket";
import type {
  VisitConfirmedPayload,
  MemberLocationPayload,
} from "@/types/socket";

interface UseExplorationSocketParams {
  explorationId: number;
  token?: string;
  enabled?: boolean;
  onVisit?: (payload: VisitConfirmedPayload) => void;
  onLocation?: (payload: MemberLocationPayload) => void;
}

/**
 * 탐험 화면 진입 시 STOMP 연결 + 탐험 topic 구독, 이탈 시 연결 종료.
 * onVisit/onLocation은 ref로 잡아, 콜백이 매 렌더 새로 생성돼도
 * 소켓이 재연결되지 않게 함.
 */
const useExplorationSocket = ({
  explorationId,
  token,
  enabled = true,
  onVisit,
  onLocation,
}: UseExplorationSocketParams): void => {
  // 콜백을 ref로 잡아 최신 값을 참조 (의존성에서 제외해 재연결 방지)
  const onVisitRef = useRef(onVisit);
  const onLocationRef = useRef(onLocation);

  useEffect(() => {
    onVisitRef.current = onVisit;
    onLocationRef.current = onLocation;
  }, [onVisit, onLocation]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const client = connectClient(token);

    client.onConnect = () => {
      client.subscribe(
        `/topic/explorations/${explorationId}/visits`,
        (message: IMessage) => {
          onVisitRef.current?.(
            JSON.parse(message.body) as VisitConfirmedPayload,
          );
        },
      );

      client.subscribe(
        `/topic/explorations/${explorationId}/locations`,
        (message: IMessage) => {
          onLocationRef.current?.(
            JSON.parse(message.body) as MemberLocationPayload,
          );
        },
      );
    };

    return () => {
      disconnectClient();
    };
  }, [enabled, explorationId, token]);
};

export default useExplorationSocket;
