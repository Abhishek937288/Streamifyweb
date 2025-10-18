import React from "react";
import { login } from "../lib/api.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useLogin = () => {
  const queryClient = useQueryClient();
  const loggedUser = useMutation({
    mutationFn: login,
    onSuccess: () => {
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
