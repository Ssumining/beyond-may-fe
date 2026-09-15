import { API_ENDPOINTS } from "@/services/constant/endpoint";
import { api } from "@/services/lib/axios";
import type {
  TeamVisitListResponse,
  SaveVisitRecordRequest,
  SaveVisitRecordResponse,
} from "@/types/record";

export const getTeamVisits = async (
  explorationId: string,
): Promise<TeamVisitListResponse> => {
  const res = await api.get<TeamVisitListResponse>(
    API_ENDPOINTS.exploration.teamVisits(explorationId),
  );
  return res.data!;
};

/** 방문 기록(사진·메모)을 저장한다. 사진은 같은 키 files로 여러 장, memo는 선택. */
export const postVisitRecord = async (
  visitId: number,
  { memo, photos }: SaveVisitRecordRequest,
): Promise<SaveVisitRecordResponse> => {
  const formData = new FormData();
  if (memo !== undefined) formData.append("memo", memo);
  (photos ?? []).forEach((photo) => formData.append("files", photo));
  const response = await api.postForm<SaveVisitRecordResponse>(
    API_ENDPOINTS.record.visitRecord(visitId),
    formData,
  );
  return response.data!;
};