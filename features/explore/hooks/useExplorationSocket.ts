import { useEffect, useRef } from "react";
import type { IMessage } from "@stomp/stompjs";
import { connectClient, disconnectClient, publishMessage } from "@/lib/socket";
import type {
  VisitConfirmedPayload,
  MemberLocationPayload,
  MemberPresencePayload,
  LocationUpdatePayload,
} from "@/types/socket";

interface UseExplorationSocketParams {
  explorationId: number;
  token?: string;
  enabled?: boolean;
  onVisit?: (payload: VisitConfirmedPayload) => void;
  onLocation?: (payload: MemberLocationPayload) => void;
  onEvent?: (payload: MemberPresencePayload) => void;
}

/**
 * 탐험 화면 진입 시 STOMP 연결 + topic 구독(visits·locations·events),
 * 이탈 시 연결 종료. 내 위치 발행 함수를 반환.
 */
const useExplorationSocket = ({
  explorationId,
  token,
  enabled = true,
  onVisit,
  onLocation,
  onEvent,
}: UseExplorationSocketParams) => {
  const onVisitRef = useRef(onVisit);
  const onLocationRef = useRef(onLocation);
  const onEventRef = useRef(onEvent);

  useEffect(() => {
    onVisitRef.current = onVisit;
    onLocationRef.current = onLocation;
    onEventRef.current = onEvent;
  }, [onVisit, onLocation, onEvent]);

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

      client.subscribe(
        `/topic/explorations/${explorationId}/events`,
        (message: IMessage) => {
          onEventRef.current?.(
            JSON.parse(message.body) as MemberPresencePayload,
          );
        },
      );
    };

    return () => {
      disconnectClient();
    };
  }, [enabled, explorationId, token]);

  // 내 위치 발행
  const sendLocation = (payload: LocationUpdatePayload): void => {
    publishMessage(`/app/explorations/${explorationId}/locations`, payload);
  };

  return { sendLocation };
};

export default useExplorationSocket;
