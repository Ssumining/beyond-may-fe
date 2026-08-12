import { useEffect, useRef } from "react";
import { getSocket } from "@/lib/socket";
import type { ServerToClientEvents } from "@/types/socket";

/**
 * 서버 수신 이벤트 하나를 구독하고 언마운트 시 자동 해제.
 * handler가 매 렌더 바뀌어도 재구독하지 않도록 ref로 최신값 유지.
 */
const useSocketEvent = <EventName extends keyof ServerToClientEvents>(
  event: EventName,
  handler: ServerToClientEvents[EventName],
): void => {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const socket = getSocket();
    const listener = ((...args: unknown[]) => {
      (handlerRef.current as (...args: unknown[]) => void)(...args);
    }) as ServerToClientEvents[EventName];

    socket.on(event, listener as never);

    return () => {
      socket.off(event, listener as never);
    };
  }, [event]);
};

export default useSocketEvent;
