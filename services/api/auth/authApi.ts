import { api } from "@/services/lib/axios";
import { API_ENDPOINTS } from "@/services/constant/endpoint";
import type { LoginRequest, LoginResponse } from "@/types/user";

export const postLogin = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>(API_ENDPOINTS.auth.login, data);
  return res.data;
};
