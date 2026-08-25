import { useMutation } from "@tanstack/react-query";

import { postLogin } from "@/services/api/auth/authApi";
import useSessionStore from "@/stores/sessionStore";

export const usePostLoginMutation = () => {
  const setSession = useSessionStore((state) => state.setSession);

  return useMutation({
    mutationFn: postLogin,
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      setSession(data.nickname);
    },
  });
};
