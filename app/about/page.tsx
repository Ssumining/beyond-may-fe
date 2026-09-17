import AppHeader from "@/components/layout/AppHeader";

interface Feature {
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    title: "성향 진단",
    description: "7개 문항으로 사색·미식·예술·기억 4가지 여행 성향을 진단해요.",
  },
  {
    title: "로컬 큐레이션 스와이프 선택",
    description:
      "팀이 직접 발굴한 광주 로컬 장소를 우선 추천받고, 마음에 드는 곳을 스와이프로 골라요.",
  },
  {
    title: "AI 코스 설계",
    description:
      "고른 장소를 실제 도보 동선에 맞춰 하나의 코스로 엮고, 대화로 수정하거나 직접 순서를 편집해요.",
  },
  {
    title: "팀과 함께 지도 밝히기",
    description:
      "현장에 방문해 GPS 인증을 마치면 지도가 성향 색으로 물들고, 팀원의 진행 상황도 실시간으로 확인할 수 있어요.",
  },
];

/**
 * 서비스 소개 화면.
 * 사이드바 "서비스 소개" 링크의 진입점 — 서비스 소개와 함께,
 * 서비스에 사용된 공공저작물(오매나 캐릭터·관광 사진)의 출처를 표시한다.
 * 공공누리 제2유형(출처표시·상업적 이용금지) 조건에 따른 필수 표기.
 */
const AboutPage = () => (
  <main className="bg-neutral-01 mx-auto min-h-dvh w-full max-w-[430px] pb-[max(40px,env(safe-area-inset-bottom))]">
    <AppHeader backHref="/" showMenu={false} centerLabel="서비스 소개" />

    <section className="px-6 pt-7">
      <p className="text-primary-08 text-[12px] font-semibold tracking-[0.12em]">
        ABOUT
      </p>
      <h1 className="text-neutral-07 mt-2 text-[26px] leading-[1.3] font-bold">
        5월 너머의 광주
      </h1>
      <p className="text-neutral-04 mt-3 text-[14px] leading-[1.6]">
        특정 시기에만 회자되던 광주가 사계절 내내 찾고 싶은 여행지로 자리잡기를
        바라는 마음에서 시작된 여행 서비스예요.
      </p>
      <p className="text-neutral-04 mt-3 text-[14px] leading-[1.6]">
        한국관광공사 데이터와 직접 발굴한 로컬 큐레이션을 더해 광주의 다양한
        매력을 소개하고, 여행 성향 진단으로 나에게 맞는 장소를 찾아 하나의
        코스로 완성해요. 완성된 코스는 지도 위에서 직접 걸으며 채워가요 — 장소를
        방문할 때마다 지도가 성향 색으로 물들고, 팀원과 실시간으로 함께 밝혀갈
        수 있어요.
      </p>
    </section>

    <section className="px-6 pt-8">
      <h2 className="text-neutral-07 text-[15px] font-semibold">
        이런 걸 할 수 있어요
      </h2>
      <ul className="mt-4 flex flex-col gap-4">
        {FEATURES.map((feature, index) => (
          <li key={feature.title} className="flex gap-3">
            <span className="bg-neutral-07 text-neutral-01 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
              {index + 1}
            </span>
            <div>
              <p className="text-neutral-07 text-[14px] font-semibold">
                {feature.title}
              </p>
              <p className="text-neutral-05 mt-1 text-[13px] leading-normal">
                {feature.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>

    <section className="border-neutral-03 mx-6 mt-8 rounded-[20px] border bg-white p-5">
      <h2 className="text-neutral-07 text-[15px] font-semibold">이미지 출처</h2>

      <div className="mt-4 flex gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/omaena/artist-palette.png"
          alt=""
          aria-hidden="true"
          className="bg-neutral-02 h-14 w-14 shrink-0 rounded-2xl object-contain p-1"
        />
        <div className="min-w-0">
          <p className="text-neutral-07 text-[13px] font-semibold">오매나</p>
          <p className="text-neutral-05 mt-1 text-[11px] leading-[1.6]">
            OMAENA © 2020. Gwangju Metropolitan City. All Rights Reserved.
            <br />
            광주광역시 공식 관광 캐릭터를 성향 유형별로 재구성해 사용했습니다.
          </p>
        </div>
      </div>

      <div className="border-neutral-03 mt-4 flex gap-3 border-t pt-4">
        <div className="bg-neutral-02 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl">
          <span className="text-neutral-04 text-[11px] font-semibold">
            光州
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-neutral-07 text-[13px] font-semibold">장소 사진</p>
          <p className="text-neutral-05 mt-1 text-[11px] leading-[1.6]">
            일부 장소 사진은 광주문화관광(tour.gwangju.go.kr)에서 제공받은
            공공저작물이며, 출처표시·상업적 이용금지 조건으로 사용했습니다.
          </p>
        </div>
      </div>
    </section>
  </main>
);

export default AboutPage;
