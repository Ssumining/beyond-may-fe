import { io, Socket } from "socket.io-client";
import { ENV } from "@/lib/env";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/types/socket";

type ExploreSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: ExploreSocket | null = null;

const createSocket = (): ExploreSocket =>
  io(ENV.SOCKET_URL, {
    autoConnect: false, // 탐험 진입 시 명시적으로 연결
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

/** 단일 인스턴스 반환 (없으면 생성) */
export const getSocket = (): ExploreSocket => {
  if (!socket) {
    socket = createSocket();
  }
  return socket;
};

/** 연결 시작. 세션 토큰은 핸드셰이크 auth로 전달 */
export const connectSocket = (token?: string): ExploreSocket => {
  const current = getSocket();
  if (token) {
    // TODO: 소켓 인증 방식(핸드셰이크 auth token) 확인 (backend)
    current.auth = { token };
  }
  if (!current.connected) {
    current.connect();
  }
  return current;
};

/** 연결 해제 */
export const disconnectSocket = (): void => {
  if (socket?.connected) {
    socket.disconnect();
  }
};
