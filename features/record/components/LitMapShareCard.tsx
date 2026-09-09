interface LitMapShareCardProps {
  visitCount: number;
  placeNames: string[];
}

/**
 * "밝힌 지도" 공유용 정적 카드.
 * 실제 카카오맵(원격 타일)은 CORS 제약으로 html-to-image 캡처가 불안정해
 * (hooks/useCaptureImage.ts 참고) 캡처 전용으로 별도로 그린 정적 비주얼을 쓴다.
 */
const GLOW_POSITIONS = [
  { top: "22%", left: "28%" },
  { top: "38%", left: "62%" },
  { top: "52%", left: "20%" },
  { top: "60%", left: "72%" },
  { top: "74%", left: "42%" },
];

const LitMapShareCard = ({ visitCount, placeNames }: LitMapShareCardProps) => {
  const litCount = Math.min(visitCount, GLOW_POSITIONS.length);

  return (
    <div className="bg-neutral-07 relative aspect-[4/5] overflow-hidden p-6 text-white">
      {GLOW_POSITIONS.map((position, index) => (
        <span
          key={`${position.top}-${position.left}`}
          aria-hidden="true"
          className="bg-primary-08 absolute h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
          style={{
            top: position.top,
            left: position.left,
            opacity: index < litCount ? 0.75 : 0.08,
          }}
        />
      ))}
      <div className="relative flex h-full flex-col">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-white/75">
          5월 너머의 광주
        </p>
        <div className="mt-auto">
          <p className="text-[11px] font-semibold text-white/75">
            LIGHTS ON THE MAP
          </p>
          <p className="mt-2 text-[30px] leading-tight font-bold tracking-[-0.05em]">
            {visitCount}곳을 밝혔어요
          </p>
          {placeNames.length > 0 && (
            <p className="mt-4 line-clamp-2 text-[12px] leading-[1.5] text-white/80">
              {placeNames.join(" · ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LitMapShareCard;
