import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getUser } from '../lib/api.js';

const useAuthUser = () => {
 const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn : getUser,
     retry: false
 })
 return {isLoading: authUser.isLoading , authUser : authUser.data?.user}
}

export default useAuthUser;