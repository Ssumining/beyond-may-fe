import { io, Socket } from "socket.io-client";
import { ENV } from "@/lib/env";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/types/socket";

type ExploreSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: ExploreSocket | null = null;

/** 토큰을 query로 실어 소켓 생성 (netty-socketio는 handshake query에서 토큰 검증) */
const createSocket = (token?: string): ExploreSocket =>
  io(ENV.SOCKET_URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    query: token ? { token } : undefined,
  });

/** 단일 인스턴스 반환 (없으면 생성) */
export const getSocket = (): ExploreSocket => {
  if (!socket) {
    socket = createSocket();
  }
  return socket;
};

/**
 * 연결 시작. 토큰을 query로 전달해야 하므로,
 * 토큰이 있으면 기존 인스턴스를 버리고 토큰을 실어 새로 생성한다.
 */
export const connectSocket = (token?: string): ExploreSocket => {
  // 토큰이 주어졌는데 기존 소켓이 없거나 이미 연결돼 있으면 새로 만든다
  if (token) {
    if (socket?.connected) {
      socket.disconnect();
    }
    socket = createSocket(token);
  }

  const current = getSocket();
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
