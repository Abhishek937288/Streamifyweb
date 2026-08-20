import { login } from "../lib/api.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useLogin = () => {
  const queryClient = useQueryClient();
  const loggedUser = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("jwt", data.token);
      }
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return {
    error: loggedUser.error,
    isPending: loggedUser.isPending,
    loginMutation: loggedUser.mutate,
  };
};

export default useLogin;
