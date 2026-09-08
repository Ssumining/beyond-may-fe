import { API_ENDPOINTS } from "@/services/constant/endpoint";
import { api } from "@/services/lib/axios";
import type {
  UploadVisitPhotoResponse,
  VisitedPlaceRecordListResponse,
} from "@/types/record";

/** 내 방문 장소 목록을 조회한다 (여행 기록 화면, 장소×사용자 단위). */
export const getVisitedPlaces =
  async (): Promise<VisitedPlaceRecordListResponse> => {
    const response = await api.get<VisitedPlaceRecordListResponse>(
      API_ENDPOINTS.record.visits,
    );
    return response.data!;
  };

/** 방문 장소 인증 사진을 업로드한다. */
export const postVisitPhoto = async (
  visitId: number,
  photo: File,
): Promise<UploadVisitPhotoResponse> => {
  const formData = new FormData();
  formData.append("photo", photo);
  const response = await api.post<UploadVisitPhotoResponse>(
    API_ENDPOINTS.record.visitPhoto(visitId),
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data!;
};
