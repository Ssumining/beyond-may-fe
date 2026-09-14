import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import AppHeader from "@/components/layout/AppHeader";
import { cn } from "@/lib/cn";
import { getResultTheme } from "@/features/onboarding/utils/resultTheme";
import type { PreferenceType } from "@/types/preference";

const RESULTS: Record<
  PreferenceType,
  { name: string; tags: string[]; description: string }
> = {
  thinker: {
    name: "사색러",
    tags: ["성찰", "느린 골목"],
    description:
      "익숙한 도시에서도 조용한 자리를 발견하고 천천히 생각을 쌓는 여행자예요.",
  },
  foodie: {
    name: "미식러",
    tags: ["로컬 음식", "골목"],
    description:
      "한 끼의 맛과 오래된 가게의 이야기를 따라 도시를 기억하는 여행자예요.",
  },
  artist: {
    name: "예술러",
    tags: ["문화", "영감"],
    description:
      "전시와 공연, 골목의 작은 장면에서 새로운 감각을 발견하는 여행자예요.",
  },
  remember: {
    name: "기억러",
    tags: ["역사", "도시의 이야기"],
    description:
      "장소가 품은 사람과 시간의 이야기를 오래 기억하며 걷는 여행자예요.",
  },
};

interface SharedResultPageProps {
  params: Promise<{ type: string }>;
}

export const generateMetadata = async ({
  params,
}: SharedResultPageProps): Promise<Metadata> => {
  const { type } = await params;
  const result = RESULTS[type as PreferenceType];
  if (!result) return {};
  const title = `나는 ${result.name} · 5월 너머의 광주`;
  return {
    title,
    description: result.description,
    openGraph: { title, description: result.description, type: "website" },
  };
};

const SharedResultPage = async ({ params }: SharedResultPageProps) => {
  const { type } = await params;
  const result = RESULTS[type as PreferenceType];
  if (!result) notFound();

  const theme = getResultTheme(type as PreferenceType);
  // 예술러/미식러처럼 배경이 밝은 톤이면 글자를 어둡게(neutral-07), 아니면 밝게(neutral-01).
  const text = theme.isLight ? "text-neutral-07" : "text-neutral-01";
  const text90 = theme.isLight ? "text-neutral-07/90" : "text-neutral-01/90";
  const chipBg = theme.isLight ? "bg-neutral-07/10" : "bg-neutral-01/20";

  return (
    <main className="bg-neutral-01 mx-auto min-h-dvh w-full max-w-[430px]">
      <AppHeader showMenu={false} />
      <section className="px-6 pt-8 pb-12">
        <p className="text-primary-08 text-[12px] font-semibold tracking-[0.12em]">
          SHARED TRAVEL TYPE
        </p>
        <div
          className="motion-safe:animate-card-pendulum mt-4 origin-bottom overflow-hidden rounded-[32px] p-7 shadow-[0_16px_48px_rgba(20,20,20,0.12)]"
          style={{
            background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
          }}
        >
          <p className={cn(text90, "text-[13px] font-medium")}>
            광주 여행 성향
          </p>
          <h1
            className={cn(
              text,
              "mt-3 text-[42px] font-bold tracking-[-0.04em]",
            )}
          >
            {result.name}
          </h1>
          <div className="mt-5 flex flex-wrap gap-2">
            {result.tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  chipBg,
                  text,
                  "rounded-full px-3 py-1.5 text-[12px] font-medium",
                )}
              >
                #{tag}
              </span>
            ))}
          </div>
          <p className={cn(text, "mt-4 text-[15px] leading-[1.7]")}>
            {result.description}
          </p>
        </div>
        <h2 className="text-neutral-07 mt-10 text-[22px] font-bold">
          당신의 광주 여행 유형도 찾아보세요
        </h2>
        <p className="text-neutral-04 mt-2 text-[13px] leading-[1.6]">
          7개의 질문에 답하면 나에게 맞는 장소와 코스를 추천해 드려요.
        </p>
        <Link
          href="/onboarding"
          className="bg-neutral-07 text-neutral-01 mt-6 flex min-h-12 w-full items-center justify-center rounded-full px-5 text-[15px] font-semibold"
        >
          성향 검사 시작
        </Link>
      </section>
    </main>
  );
};

export default SharedResultPage;
