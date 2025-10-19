import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api.js";
import toast from "react-hot-toast";

const useLogout = () => {
  const queryClient = useQueryClient();
  const user = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("user Logged out");
    },
    onError: () => {
      toast.console.error();
      ("error while logout");
    },
  });

  return { logoutMutation: user.mutate };
};

export default useLogout;
