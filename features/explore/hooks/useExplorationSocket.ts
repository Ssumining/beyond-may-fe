import { useEffect } from "react";
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
  /** 방문 이벤트 수신 콜백 */
  onVisit?: (payload: VisitConfirmedPayload) => void;
  /** 위치 이벤트 수신 콜백 */
  onLocation?: (payload: MemberLocationPayload) => void;
}

/**
 * 탐험 화면 진입 시 STOMP 연결 + 탐험 topic 구독, 이탈 시 구독 해제 + 연결 종료.
 */
const useExplorationSocket = ({
  explorationId,
  token,
  enabled = true,
  onVisit,
  onLocation,
}: UseExplorationSocketParams): void => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const client = connectClient(token);

    // 연결이 완료돼야 subscribe 가능 → onConnect 콜백에서 구독
    client.onConnect = () => {
      client.subscribe(
        `/topic/explorations/${explorationId}/visits`,
        (message: IMessage) => {
          onVisit?.(JSON.parse(message.body) as VisitConfirmedPayload);
        },
      );

      client.subscribe(
        `/topic/explorations/${explorationId}/locations`,
        (message: IMessage) => {
          onLocation?.(JSON.parse(message.body) as MemberLocationPayload);
        },
      );
    };

    return () => {
      disconnectClient(); // 연결 종료 시 구독도 함께 정리됨
    };
  }, [enabled, explorationId, token, onVisit, onLocation]);
};

export default useExplorationSocket;
