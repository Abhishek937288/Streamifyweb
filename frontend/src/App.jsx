import React from "react";
import "./App.css";
import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import NotificationsPage from "./pages/NotificationsPage";
import ChatPage from "./pages/ChatPage";
import CallPage from "./pages/CallPage";
import OnboardingPage from "./pages/OnboardingPage";
import toast, { Toaster } from "react-hot-toast";
import { axiosInstance } from "./lib/axios";
import { useQuery } from "@tanstack/react-query";

function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      const res = axiosInstance.get("/auth/me");
      return res.data;
    },
  });

  console.log(data);
  return (
    <div className=" h-screen" data-theme="night">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/call" element={<CallPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
