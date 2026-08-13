import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import type { ExplorationJoinPayload } from "@/types/socket";

interface UseExplorationSocketParams {
  explorationId: number;
  /** 세션 토큰 (query로 전달됨) */
  token?: string;
  /** 소켓을 실제로 연결할지 여부 (탐험 진입 시 true) */
  enabled?: boolean;
}

/**
 * 탐험 화면 진입 시 소켓 연결 + 방 합류, 이탈 시 방 나가기 + 연결 해제.
 * 실시간 이벤트 구독은 각 화면에서 useSocketEvent로 처리.
 *
 * userId는 서버가 인증 handshake로 식별하므로 payload에 넣지 않는다.
 * 재연결 시에도 exploration:join을 보내면 서버가 exploration:state를 돌려준다.
 */
const useExplorationSocket = ({
  explorationId,
  token,
  enabled = true,
}: UseExplorationSocketParams): void => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const socket = connectSocket(token);

    const joinPayload: ExplorationJoinPayload = { explorationId };

    const handleConnect = (): void => {
      socket.emit("exploration:join", joinPayload);
    };

    if (socket.connected) {
      handleConnect();
    } else {
      socket.on("connect", handleConnect);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.emit("exploration:leave", { explorationId });
      disconnectSocket();
    };
  }, [enabled, explorationId, token]);
};

export default useExplorationSocket;
