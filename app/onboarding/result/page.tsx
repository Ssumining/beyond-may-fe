"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import GradientBackground from "@/components/ui/GradientBackground";
import AppHeader from "@/components/layout/AppHeader";
import ShareSheet from "@/components/share-sheet/ShareSheet";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Share from "@/components/ui/icons/Share";
import Undo from "@/components/ui/icons/Undo";
import { useCaptureImage } from "@/hooks/useCaptureImage";
import { useGetPreferenceResultQuery } from "@/features/onboarding/hooks/useGetPreferenceResultQuery";
import ResultTypeCard from "@/features/onboarding/components/ResultTypeCard";
import RecommendedPlaceList from "@/features/onboarding/components/RecommendedPlaceList";
import ShareRecordCard from "@/features/onboarding/components/ShareRecordCard";
import ShareCollageCard from "@/features/onboarding/components/ShareCollageCard";

/**
 * 성향 검사 결과 화면 (기능명세 1.2.2).
 *
 * 결과 계산을 기다리는 로딩 화면을 먼저 보여주고,
 * 결과 도착 시 유형 카드 + 추천 장소 목록으로 자동 전환.
 *
 * 결과 화면 본문은 흰 배경·검정 텍스트로 고정 (유형별 그라디언트는 공유 카드에서만).
 *
 * TODO: userId는 세션/로그인에서 얻어야 하나 현재 미확정 → 임시값 사용. (#13 세션)
 * TODO: 하단 액션 영역 중 닉네임/시작하기는 후속 이슈. (#13/#14)
 *   이미지 저장/공유, 다시하기는 이번 이슈(#29)에서 구현.
 */

/** 공유 이미지 버전: 화면 그대로(기록형) / 우표 엽서(스토리형, 원본 피그마 목업 기준) */
const SHARE_VERSIONS = [
  { id: "record", label: "화면 그대로" },
  { id: "collage", label: "우표 엽서" },
] as const;
type ShareVersionId = (typeof SHARE_VERSIONS)[number]["id"];

const ResultPage = () => {
  const router = useRouter();
  // TODO: 실제 userId를 세션에서 가져오도록 교체. (#13)
  const TEMP_USER_ID = 1;

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareVersion, setShareVersion] = useState<ShareVersionId>("record");
  /** 이미지 생성 실패 시 다시 시도할 동작을 담아둔다. null이면 에러 모달 닫힘. */
  const [captureRetry, setCaptureRetry] = useState<(() => void) | null>(null);
  const {
    ref: shareCardRef,
    isCapturing,
    download,
    share,
  } = useCaptureImage<HTMLDivElement>();

  const { data, isLoading, isError, refetch } =
    useGetPreferenceResultQuery(TEMP_USER_ID);

  // 로딩/에러: 결과 계산 대기 화면 (그라디언트 배경)
  if (isLoading || isError || !data) {
    return (
      <main className="bg-neutral-01 relative mx-auto flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden">
        <GradientBackground className="opacity-70" />

        {/* 상단 헤더 (Home). 로딩 화면 디자인 기준 */}
        <AppHeader showMenu={false} className="text-neutral-04" />

        {isError ? (
          <section className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <p className="text-neutral-07/70 text-[15px]">
              결과를 불러오지 못했어요.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="border-neutral-07 text-neutral-07 rounded-full border px-6 py-3 text-[15px] font-medium"
            >
              다시 시도
            </button>
          </section>
        ) : (
          <>
            <section className="flex flex-1 flex-col items-center justify-center px-8 text-center">
              <p className="text-neutral-07 text-[20px] leading-relaxed font-medium">
                당신의 여행 유형을
                <br />
                분석하고 있어요
              </p>
              <span
                className="border-neutral-07/20 border-t-neutral-07 mt-2 block h-[42px] w-[42px] animate-spin rounded-full border-2"
                role="status"
                aria-label="여행 유형을 분석하는 중"
              />
            </section>
            <p className="text-neutral-05 mt-28 text-center text-[14px]">
              뒤로 가지 말고 잠시만 기다려 주세요.
            </p>
          </>
        )}
      </main>
    );
  }

  const handleDownload = async () => {
    try {
      await download({ fileName: `beyond-may-${data.type}-${shareVersion}` });
    } catch {
      setCaptureRetry(() => handleDownload);
    }
  };

  const handleShare = async () => {
    const result = await share({
      fileName: `beyond-may-${data.type}-${shareVersion}`,
      shareTitle: `나는 ${data.mbtiName}`,
      shareText: `광주 여행 성향 검사 결과: ${data.mbtiName}`,
    });
    if (result === "failed") {
      setCaptureRetry(() => handleShare);
    }
  };

  // 결과 도착: 유형 카드 + 추천 장소 (흰 배경)
  return (
    <main className="bg-neutral-01 mx-auto min-h-[100dvh] w-full max-w-[430px] pb-16">
      <AppHeader showMenu={false} className="text-neutral-04" />

      <ResultTypeCard result={data} />
      <RecommendedPlaceList
        mbtiName={data.mbtiName}
        places={data.recommendedPlaces}
      />

      <section className="mt-6 flex gap-3 px-6">
        <Button
          size="lg"
          icon={<Share className="h-4.5 w-4.5" />}
          onClick={() => setIsShareOpen(true)}
          className="flex-2"
        >
          결과 이미지 공유하기
        </Button>
        <Button
          size="lg"
          icon={<Undo className="h-4.5 w-4.5" />}
          onClick={() => router.push("/onboarding")}
          className="flex-1"
        >
          다시하기
        </Button>
      </section>

      {/* TODO: 닉네임/시작하기 액션은 후속 이슈 (#13/#14) */}

      <ShareSheet
        open={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        versions={[...SHARE_VERSIONS]}
        selectedVersionId={shareVersion}
        onSelectVersion={(id) => setShareVersion(id as ShareVersionId)}
        isProcessing={isCapturing}
        onDownload={handleDownload}
        onShare={handleShare}
      >
        {shareVersion === "record" ? (
          <ShareRecordCard ref={shareCardRef} result={data} />
        ) : (
          <ShareCollageCard ref={shareCardRef} result={data} />
        )}
      </ShareSheet>

      <Modal open={captureRetry !== null} onClose={() => setCaptureRetry(null)}>
        <p className="text-neutral-07 text-[16px] font-semibold">
          이미지를 만들지 못했어요
        </p>
        <p className="text-neutral-05 mt-2 text-[13px] leading-relaxed">
          잠시 후 다시 시도해 주세요.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <Button
            variant="solid"
            size="lg"
            className="w-full"
            onClick={() => {
              const retry = captureRetry;
              setCaptureRetry(null);
              retry?.();
            }}
          >
            다시 시도
          </Button>
          <Button
            size="lg"
            className="w-full"
            onClick={() => setCaptureRetry(null)}
          >
            닫기
          </Button>
        </div>
      </Modal>
    </main>
  );
};

export default ResultPage;
