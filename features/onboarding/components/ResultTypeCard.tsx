import { format } from "date-fns";
import type { PreferenceResultResponse } from "@/types/preference";

interface ResultTypeCardProps {
  result: PreferenceResultResponse;
}

/**
 * 결과 화면 상단 유형 카드 (기능명세 1.2.2).
 * 우표형 일러스트 + "나는 OOO" + 키워드 칩 + 유형 설명.
 *
 *
 * TODO: 키워드 칩 데이터 확정. (backend/design)
 *   현재 mbtiTag(예: 성찰·역사)와 디자인 칩(느린산책/골목탐색/기록/사진)이 다름.
 *   칩용 필드가 별도인지 확인 필요. 지금은 mbtiTag를 칩으로 노출.
 */

const ResultTypeCard = ({ result }: ResultTypeCardProps) => {
  const { mbtiName, mbtiTag, mbtiImg, mbtiDescription } = result;
  const stampDate = format(new Date(), "yyyy.MM.dd");

  return (
    <section className="px-6 pt-3">
      <div className="flex items-end gap-4">
        {/* 우표형 일러스트 (살짝 기울임) */}
        <div className="border-neutral-02 bg-neutral-01 relative w-[46%] shrink-0 -rotate-2 border px-2.5 pt-2.5 pb-1">
          <div className="border-neutral-07 relative aspect-3/4 border border-dashed">
            {mbtiImg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mbtiImg}
                alt={`${mbtiName} 대표 이미지`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-neutral-04 flex h-full w-full items-center justify-center px-1.5 pt-1.5 pb-6.5 text-[14px]">
                {mbtiName}
              </div>
            )}
            <span className="text-neutral-07 absolute bottom-1.5 left-1.5 text-[8px] font-bold tracking-wider">
              GWANGJU
            </span>
            <span className="text-neutral-07 absolute right-1.5 bottom-1.5 text-[11px] font-normal">
              ₩330
            </span>

            {/* 원형 도장 (점선 우상단에 걸침, 점선과 함께 기울어짐) */}
            <div className="border-neutral-04 text-neutral-04 absolute -top-4 -right-6 flex h-14 w-14 -rotate-13 flex-col items-center justify-center rounded-full border-2 bg-[#FBF7EE]/35">
              <span className="text-[10px] leading-none font-bold">光州</span>
              <span className="mt-0.5 text-[7px] leading-none font-normal">
                {stampDate}
              </span>
            </div>
          </div>

          {/* 실선 틀 하단 유형명 */}
          <p className="text-neutral-07 mt-2 text-center text-[12px]">
            {mbtiName}
          </p>
        </div>

        {/* 유형명 */}
        <div className="pb-2 text-left">
          <p className="text-neutral-07 text-[20px] font-medium">나는</p>
          <h1 className="text-neutral-07 text-[40px] leading-tight font-bold">
            {mbtiName}
          </h1>
        </div>
      </div>

      {/* 키워드 칩 */}
      <div className="mt-5 flex flex-wrap gap-2.5">
        {mbtiTag.map((tag) => (
          <span
            key={tag}
            className="border-neutral-07 text-neutral-07 rounded-3xl border px-4 py-1.5 text-[13px] font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 설명 */}
      <p className="text-neutral-07 mt-4 text-[14px] leading-relaxed">
        {mbtiDescription}
      </p>
    </section>
  );
};

export default ResultTypeCard;
