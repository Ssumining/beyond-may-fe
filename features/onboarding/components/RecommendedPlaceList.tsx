import type { RecommendedPlace } from "@/types/preference";

interface RecommendedPlaceListProps {
  /** 유형명 (제목 "OOO를 위한 광주"에 사용) */
  mbtiName: string;
  places: RecommendedPlace[];
}

/**
 * 결과 화면 추천 장소 목록 (기능명세 1.2.2).
 * "OOO를 위한 광주" 제목 + 장소 카드(사진 + 이름 + 한 줄 설명) 5개 이상.
 *
 * TODO: placeImg URL 확정 전까지 회색 placeholder 표시. (backend)
 */

const RecommendedPlaceList = ({
  mbtiName,
  places,
}: RecommendedPlaceListProps) => {
  return (
    <section className="mt-6.5 px-6">
      <h2 className="text-neutral-07 text-xl font-semibold">
        {mbtiName}를 위한 광주
      </h2>

      <ul className="mt-3 flex flex-col gap-4">
        {places.map((place) => (
          <li key={place.placeId}>
            {/* 장소 사진 (URL 없으면 회색 placeholder) */}
            <div className="bg-neutral-03 rounded-card aspect-video w-full overflow-hidden">
              {place.placeImg && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={place.placeImg}
                  alt={place.placeName}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <h3 className="text-neutral-07 mt-3 text-lg font-medium">
              {place.placeName}
            </h3>
            <p className="text-neutral-04 mt-1 text-sm leading-relaxed font-light">
              {place.placeIntro}
            </p>
          </li>
        ))}
      </ul>
      <div className="border-neutral-05 -mx-6 mt-10 border-t" />
    </section>
  );
};

export default RecommendedPlaceList;
