/**
 * 지도에 표시하는 핀.
 * 상태에 따라 형태가 달라진다.
 * - default: 물방울 핀 + 남은 순서 번호
 * - current: 깃발 + 번호 (다음 목적지)
 * - visited: 작은 물방울 핀 + 체크 (다녀온 곳 — 미방문보다 작게)
 */
import type { ReactNode } from "react";

interface MapPinProps {
  order?: number; // 남은 코스 기준 순서 (visited는 사용 안 함)
  color: string; // 유형 색 RGB ("160, 126, 234")
  state?: "default" | "current" | "visited";
}

const FILL_OPACITY = 0.92;
const PIN_SIZE = 30; // 물방울 핀 지름 (깃발 높이와 맞춤)
const VISITED_SCALE = 0.85; // 방문 완료 핀은 미방문 대비 작게 (다녀온 느낌)

/** 위는 둥글고 아래로 뾰족한 물방울 핀 */
const DropPin = ({
  color,
  size = PIN_SIZE,
  children,
}: {
  color: string;
  size?: number;
  children?: ReactNode;
}) => (
  <div
    className="flex items-center justify-center"
    style={{
      width: size,
      height: size,
      backgroundColor: `rgba(${color}, ${FILL_OPACITY})`,
      borderRadius: "50% 50% 50% 0",
      border: "2px solid white",
      boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
      transform: "rotate(-45deg)",
    }}
  >
    <span
      className="text-neutral-07 font-bold"
      style={{ transform: "rotate(45deg)", fontSize: size * 0.43 }}
    >
      {children}
    </span>
  </div>
);

const MapPin = ({ order, color, state = "default" }: MapPinProps) => {
  // 방문 완료 — 작은 물방울 핀 + 체크. 미방문보다 작게 해 "다녀온 곳"을 표시한다.
  // (주변 glow가 방문 여부를 색으로 함께 표시)
  if (state === "visited") {
    return (
      <DropPin color={color} size={PIN_SIZE * VISITED_SCALE}>
        ✓
      </DropPin>
    );
  }

  // 다음 목적지 — 깃발
  if (state === "current") {
    return (
      <div className="flex items-start">
        <div
          className="rounded-full bg-white"
          style={{
            width: 3,
            height: 42,
            boxShadow: "0 1px 3px rgba(0,0,0,0.35)",
          }}
        />
        <div
          className="text-neutral-07 flex items-center justify-center font-bold"
          style={{
            width: 32,
            height: 26,
            marginLeft: -1,
            backgroundColor: `rgba(${color}, ${FILL_OPACITY})`,
            borderRadius: "2px 4px 4px 2px",
            border: "2.5px solid white",
            boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
            fontSize: 14,
          }}
        >
          {order}
        </div>
      </div>
    );
  }

  // 기본(미방문) — 물방울 핀 + 번호
  return <DropPin color={color}>{order}</DropPin>;
};

export default MapPin;
