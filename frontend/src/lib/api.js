import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/api/auth/signup", signupData);
  return response.data;
};

export const getUser = async () => {
  try {
    const res = await axiosInstance.get("/api/auth/me");
    return res.data;
  } catch (err) {
    console.log("error in logout : ", err);
    return null;
  }
};

export const comeleteOnBoarding = async (formState) => {
  const res = await axiosInstance.post("/api/auth/onboarding", formState);
  return res.data;
};

export const login = async (loginData) => {
  const res = await axiosInstance.post("/api/auth/login", loginData);
  return res.data;
};

export const logout = async () => {
  const res = await axiosInstance.post("/api/auth/logout");
  return res.data;
};

export const getuserFriends = async () => {
  const res = await axiosInstance.get("/api/users/friends");
  return res.data;
};

export const getRecommendedUsers = async () => {
  const res = await axiosInstance.get("/api/users");
  return res.data;
};

export const getOutgoingFriendsReqs = async () => {
  const res = await axiosInstance.get("/api/users/outgoing-friend-requests");
  return res.data;
};

export const sendFriendRequest = async (userId) => {
  const res = await axiosInstance.post(`/api/users/friend-request/${userId}`);
  return res.data;
};

export const getFriendRequests = async () => {
  const res = await axiosInstance.get("/api/users/friend-requests");
  return res.data;
};

export const acceptFriendRequest = async (requestId) => {
  const res = await axiosInstance.put(`/api/users/friend-request/${requestId}/accept`);
  return res.data;
};

export const getStreamToken = async () => {
  const res = await axiosInstance.get("/api/chat/token");
  return res.data;
};