import { API_ENDPOINTS } from "@/services/constant/endpoint";
import { api } from "@/services/lib/axios";
import type {
  TeamVisitListResponse,
  UploadVisitPhotoResponse,
} from "@/types/record";

export const getTeamVisits = async (
  explorationId: string,
): Promise<TeamVisitListResponse> => {
  const res = await api.get<TeamVisitListResponse>(
    API_ENDPOINTS.exploration.teamVisits(explorationId),
  );
  return res.data!;
};

/** 방문 장소 인증 사진을 업로드한다. */
export const postVisitPhoto = async (
  visitId: number,
  photo: File,
): Promise<UploadVisitPhotoResponse> => {
  const formData = new FormData();
  formData.append("file", photo);
  const response = await api.postForm<UploadVisitPhotoResponse>(
    API_ENDPOINTS.record.visitPhoto(visitId),
    formData,
  );
  return response.data!;
};
