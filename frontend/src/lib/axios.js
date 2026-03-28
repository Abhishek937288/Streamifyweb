import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "/",        // ✅ correct
  withCredentials: true,
});