import { useEffect } from "react";
import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket";
import type { ExplorationJoinPayload } from "@/types/socket";

interface UseExplorationSocketParams {
  explorationId: number;
  courseId: number;
  userId: number;
  /** 세션 토큰 (핸드셰이크 auth 전달용) */
  token?: string;
  /** 소켓을 실제로 연결할지 여부 (탐험 진입 시 true) */
  enabled?: boolean;
}

/**
 * 탐험 화면 진입 시 소켓 연결 + 방 합류, 이탈 시 방 나가기 + 연결 해제.
 * 실시간 이벤트 구독은 각 화면에서 useSocketEvent로 처리.
 *
 * TODO: 방(room) 기준이 explorationId인지 courseId인지 백엔드 확정 후 정리 (backend)
 */
const useExplorationSocket = ({
  explorationId,
  courseId,
  userId,
  token,
  enabled = true,
}: UseExplorationSocketParams): void => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const socket = connectSocket(token);

    const joinPayload: ExplorationJoinPayload = {
      explorationId,
      courseId,
      userId,
    };

    const handleConnect = (): void => {
      socket.emit("exploration:join", joinPayload);
    };

    // 이미 연결돼 있으면 바로 합류, 아니면 connect 이후 합류
    if (socket.connected) {
      handleConnect();
    } else {
      socket.on("connect", handleConnect);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.emit("exploration:leave", { explorationId, userId });
      disconnectSocket();
    };
  }, [enabled, explorationId, courseId, userId, token]);
};

export default useExplorationSocket;
