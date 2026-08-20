import { useQuery } from "@tanstack/react-query";
import { getUser } from "../lib/api.js";

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getUser,
    retry: 3,
    retryDelay: 2000,
  });
  return {
    isLoading: authUser.isLoading,
    authUser: authUser.data?.user,
    isError: authUser.isError,
  };
};

export default useAuthUser;
