import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const getUser = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
};

export const comeleteOnBoarding = async (formState) => {
  const res = await axiosInstance.post("/auth/onboarding", formState);
  return res.data;
};


export const login  = async (loginData)=>{
  const res  = await axiosInstance.post("/auth/login",loginData);
  return res.data;
}