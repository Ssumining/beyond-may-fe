import { useMutation } from "@tanstack/react-query";

import { postSignup } from "@/services/api/auth/authApi";
import useSessionStore from "@/stores/sessionStore";

export const usePostSignupMutation = () => {
  const setSession = useSessionStore((state) => state.setSession);

  return useMutation({
    mutationFn: postSignup,
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.token);
      setSession(data.nickname, data.identificationCode);
    },
  });
};
