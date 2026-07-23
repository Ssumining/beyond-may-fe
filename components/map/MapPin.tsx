/**
 * 지도에 표시하는 핀.
 * 상태에 따라 형태가 달라진다.
 * - default: 물방울 핀 + 남은 순서 번호
 * - current: 깃발 + 번호 1 (다음 목적지)
 * - visited: 물방울 핀 + 체크 (번호 없음, 방문한 곳은 순서에서 제외)
 */
import type { ReactNode } from "react";

interface MapPinProps {
  order?: number; // 남은 코스 기준 순서 (visited는 사용 안 함)
  color: string; // 유형 색 RGB ("160, 126, 234")
  state?: "default" | "current" | "visited";
}

const FILL_OPACITY = 0.92;
const PIN_SIZE = 30; // 물방울 핀 지름 (깃발 높이와 맞춤)

/** 위는 둥글고 아래로 뾰족한 물방울 핀 */
const DropPin = ({
  color,
  children,
}: {
  color: string;
  children?: ReactNode;
}) => (
  <div
    className="flex items-center justify-center"
    style={{
      width: PIN_SIZE,
      height: PIN_SIZE,
      backgroundColor: `rgba(${color}, ${FILL_OPACITY})`,
      // 위 3개 모서리는 완전히 둥글게, 왼쪽 아래만 각지게 → 45도 회전 시 물방울
      borderRadius: "50% 50% 50% 0",
      border: "2px solid white",
      boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
      transform: "rotate(-45deg)",
    }}
  >
    {/* 내용은 다시 되돌려서 똑바로 보이게 */}
    <span
      className="text-neutral-07 font-bold"
      style={{ transform: "rotate(45deg)", fontSize: 13 }}
    >
      {children}
    </span>
  </div>
);

const MapPin = ({ order, color, state = "default" }: MapPinProps) => {
  // 방문 완료 — 체크 (주변 glow가 방문 여부를 함께 표시)
  if (state === "visited") {
    return <DropPin color={color}>✓</DropPin>;
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
