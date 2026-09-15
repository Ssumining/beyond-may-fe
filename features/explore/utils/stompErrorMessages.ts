/** STOMP 위치 처리 오류 코드 → 사용자 문구 */
const STOMP_ERROR_MESSAGES: Record<string, string> = {
  LOCATION_PAYLOAD_INVALID: "위치 정보를 처리하지 못했어요.",
  LOCATION_ACCURACY_EXCEEDED: "GPS 정확도가 낮아 위치를 공유할 수 없어요.",
  EXPLORATION_NOT_ONGOING: "진행 중인 탐험이 아니에요.",
  PARTICIPANT_NOT_ACTIVE: "탐험 참여 상태가 아니에요.",
  LOCATION_SHARING_DISABLED: "위치 공유가 꺼져 있어요.",
  LOCATION_PROCESSING_FAILED: "위치 처리 중 문제가 발생했어요.",
};

const DEFAULT_STOMP_ERROR_MESSAGE = "일시적인 오류가 발생했어요.";

/** STOMP ERROR 프레임의 message 헤더(코드)를 사용자 문구로 변환 */
export const getStompErrorMessage = (code: string | undefined): string =>
  (code && STOMP_ERROR_MESSAGES[code]) ?? DEFAULT_STOMP_ERROR_MESSAGE;