import AppHeader from "@/components/layout/AppHeader";

/**
 * 서비스 소개 화면.
 * 사이드바 "서비스 소개" 링크의 진입점 — 짧은 서비스 소개와 함께,
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
        광주 5·18의 기억이 깃든 장소들을 여행 성향에 맞춰 추천하고, 팀과 함께
        걸으며 기록을 남기는 여행 서비스예요.
      </p>
    </section>

    <section className="border-neutral-03 mx-6 mt-8 rounded-[20px] border bg-white p-5">
      <h2 className="text-neutral-07 text-[15px] font-semibold">이미지 출처</h2>

      <div className="border-neutral-03 mt-4 flex items-center gap-4 border-t pt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/omaena/artist-palette.png"
          alt="오매나 캐릭터"
          className="h-16 w-16 shrink-0 object-contain"
        />
        <p className="text-neutral-05 text-[12px] leading-[1.6]">
          OMAENA © 2020. Gwangju Metropolitan City.
          <br />
          All Rights Reserved.
        </p>
      </div>

      <p className="text-neutral-05 border-neutral-03 mt-4 border-t pt-4 text-[12px] leading-[1.6]">
        본 서비스에 사용된 일부 장소 사진은 광주광역시에서 공공누리
        제2유형(출처표시·상업적 이용금지) 조건으로 개방한 공공저작물이며,
        광주문화관광(tour.gwangju.go.kr)에서 제공받았습니다.
      </p>
    </section>
  </main>
);

export default AboutPage;
