import { api } from "@/services/lib/axios";
import { API_ENDPOINTS } from "@/services/constant/endpoint";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "@/types/user";

export const postSignup = async (
  data: SignupRequest,
): Promise<SignupResponse> => {
  const res = await api.post<SignupResponse>(API_ENDPOINTS.auth.signup, data);
  return res.data!;
};

export const postLogin = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>(API_ENDPOINTS.auth.login, data);
  return res.data!;
};

export const postLogout = async (): Promise<void> => {
  await api.post<void>(API_ENDPOINTS.auth.logout);
};
