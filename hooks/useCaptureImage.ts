"use client";

import { useCallback, useRef, useState } from "react";
import { toBlob } from "html-to-image";

/**
 * DOM 노드를 이미지(PNG)로 캡처해 다운로드하거나 공유한다.
 *
 * 결과 공유 카드뿐 아니라 추후 코스·탐험 결과처럼 지도 스크린샷이 포함된
 * 다른 화면에서도 그대로 재사용할 수 있도록 특정 기능에 종속되지 않게 만들었다.
 *
 * 주의(CORS, 리뷰 확인 필요): 캡처 대상 안의 원격 이미지(<img crossOrigin="anonymous">)는
 * 그 서버가 Access-Control-Allow-Origin을 내려줘야 정상적으로 캡처된다.
 * CORS가 안 열려 있으면 이미지 로드 자체가 실패하거나 캔버스가 오염(tainted)되어
 * captureNode() 아래 toBlob이 null/에러를 반환 → download/share 전체가 실패한다
 * (실패 시 결과 페이지의 "이미지를 만들지 못했어요" 모달로 이어짐, 조용히 무시되진 않음).
 * 지금은 mock 데이터라 이미지 URL이 비어 있어 안 터지는 것뿐이므로,
 * mbtiImg/placeImg가 실제 백엔드·카카오 이미지 서버 URL로 바뀌기 전에
 * 해당 서버들이 CORS를 허용하는지 반드시 확인해야 한다.
 * 같은 crossOrigin="anonymous"가 StampPhoto.tsx의 <image>에도 쓰여 동일하게 적용됨.
 */

interface CaptureOptions {
  /** 캡처 배율. 기본 2 (레티나 대응) */
  pixelRatio?: number;
  /** 다운로드/공유 파일명 (확장자 제외) */
  fileName?: string;
  /** Web Share API에 함께 전달할 텍스트 */
  shareTitle?: string;
  shareText?: string;
}

type CaptureResult = "downloaded" | "shared" | "cancelled" | "failed";

const captureNode = async (
  node: HTMLElement,
  pixelRatio: number,
): Promise<Blob> => {
  const blob = await toBlob(node, {
    pixelRatio,
    cacheBust: true,
    backgroundColor: undefined,
  });
  if (!blob) throw new Error("이미지를 생성하지 못했습니다.");
  return blob;
};

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const useCaptureImage = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const download = useCallback(async (options: CaptureOptions = {}) => {
    if (!ref.current) return;
    setIsCapturing(true);
    try {
      const blob = await captureNode(ref.current, options.pixelRatio ?? 2);
      downloadBlob(blob, `${options.fileName ?? "beyond-may"}.png`);
    } finally {
      setIsCapturing(false);
    }
  }, []);

  /**
   * 가능하면 Web Share API(navigator.share)로 이미지를 공유하고,
   * 지원하지 않는 환경(대부분의 데스크톱 브라우저)에서는 다운로드로 대체한다.
   */
  const share = useCallback(
    async (options: CaptureOptions = {}): Promise<CaptureResult> => {
      if (!ref.current) return "failed";
      setIsCapturing(true);
      try {
        const blob = await captureNode(ref.current, options.pixelRatio ?? 2);
        const fileName = `${options.fileName ?? "beyond-may"}.png`;
        const file = new File([blob], fileName, { type: "image/png" });

        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: options.shareTitle,
            text: options.shareText,
          });
          return "shared";
        }

        downloadBlob(blob, fileName);
        return "downloaded";
      } catch (error) {
        // 사용자가 공유 시트를 취소한 경우도 AbortError로 들어오므로 실패로 취급하지 않는다.
        if (error instanceof DOMException && error.name === "AbortError") {
          return "cancelled";
        }
        return "failed";
      } finally {
        setIsCapturing(false);
      }
    },
    [],
  );

  return { ref, isCapturing, download, share };
};
