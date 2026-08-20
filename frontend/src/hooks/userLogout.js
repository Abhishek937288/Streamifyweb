import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api.js";
import toast from "react-hot-toast";

const useLogout = () => {
  const queryClient = useQueryClient();
  const user = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("jwt");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("user Logged out");
    },
    onError: (err) => {
      console.error("error while logout:", err);
      toast.error("Logout failed. Please try again.");
    },
  });

  return { logoutMutation: user.mutate };
};

export default useLogout;
