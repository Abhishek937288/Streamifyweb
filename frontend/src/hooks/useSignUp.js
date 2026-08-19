import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";

const useSignUp = () => {
  const queryClient = useQueryClient();
  const signupUser = useMutation({
    mutationFn: signup,
    onSuccess: async () => {
      try {
        await queryClient.invalidateQueries({ queryKey: ["authUser"] });
      } catch (err) {
        console.error("Error refreshing auth state after signup:", err);
      }
    },
    onError: (err) => {
      console.error("Signup failed:", err);
    },
  });
  return {
    isPending: signupUser.isPending,
    error: signupUser.error,
    signupMutation: signupUser.mutate,
  };
};

export default useSignUp;
