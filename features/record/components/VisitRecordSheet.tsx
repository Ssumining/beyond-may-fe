"use client";

import { type ChangeEvent } from "react";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import useUploadVisitPhotoMutation from "@/features/record/hooks/useUploadVisitPhotoMutation";
import type { TeamVisit } from "@/types/record";

const MAX_PHOTOS = 10;

interface VisitRecordSheetProps {
  visit: TeamVisit | null;
  canUpload: boolean;
  onClose: () => void;
}

/** 방문 기록 시트 (5.2.1-B) — 사진 업로드(최대 10장). 메모는 백엔드 API 확정 후 추가. */
const VisitRecordSheet = ({ visit, canUpload, onClose }: VisitRecordSheetProps) => {
  const { mutate: uploadPhoto, isPending: isUploading } =
    useUploadVisitPhotoMutation();

  const handleUploadPhotos = (
    event: ChangeEvent<HTMLInputElement>,
    visitId: number,
    currentCount: number,
  ): void => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;
    files.slice(0, MAX_PHOTOS - currentCount).forEach((file) => {
      uploadPhoto({ visitId, photo: file });
    });
  };

  return (
    <Modal open={visit !== null} onClose={onClose}>
      {visit && (
        <div>
          <h2 className="text-neutral-07 text-[18px] font-bold">
            {visit.place.name}
          </h2>
          <p className="text-neutral-04 mt-1 text-[12px]">방문 인증 완료</p>

          <p className="text-neutral-07 mt-5 text-[13px] font-medium">
            사진 (최대 {MAX_PHOTOS}장)
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {visit.photos.map((photo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={photo.visitPhotoId}
                src={photo.imageUrl}
                alt=""
                aria-hidden="true"
                className="aspect-square w-full rounded-xl object-cover"
              />
            ))}
            {canUpload && visit.photos.length < MAX_PHOTOS && (
              <label
                className={`border-neutral-03 text-neutral-04 flex aspect-square w-full cursor-pointer items-center justify-center rounded-xl border border-dashed text-[24px] ${
                  isUploading ? "pointer-events-none opacity-50" : ""
                }`}
              >
                {isUploading ? "…" : "+"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  disabled={isUploading}
                  onChange={(event) =>
                    handleUploadPhotos(
                      event,
                      visit.visitId,
                      visit.photos.length,
                    )
                  }
                />
              </label>
            )}
          </div>

          {!canUpload && (
              <p className="text-neutral-04 mt-2 text-[12px]">
                완료된 여행은 사진을 추가할 수 없어요.
              </p>
            )}

          {/* TODO(#126): 메모 입력·저장 — 백엔드 메모 API 확정 후 추가 */}

          <Button size="lg" className="mt-5 w-full" onClick={onClose}>
            닫기
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default VisitRecordSheet;