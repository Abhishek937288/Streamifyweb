import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { signup } from "../lib/api";

const useSignUp = () => {
  const queryClient = useQueryClient();
  const signupUser = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
  return {
    isPending: signupUser.isPending,
    error: signupUser.error,
    signupMutation: signupUser.mutate,
  };
};

export default useSignUp;
