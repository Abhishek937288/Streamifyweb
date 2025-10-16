import React from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router";
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
import PageLoader from "./components/PageLoader";
import useAuthUser from "./hooks/useAuth.User";

function App() {
  const { isLoading, authUser } = useAuthUser();

  const isAuthinticated = Boolean(authUser);
  const isOnboarded = Boolean(authUser?.isOnboarded);

  if (isLoading) {
    return <PageLoader />;
  }
  return (
    <div className=" h-screen" data-theme="night">
      <Routes>
        <Route
          path="/"
          element={
            isAuthinticated && isOnboarded ? (
              <HomePage />
            ) : (
              <Navigate to={!isAuthinticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthinticated ? (
              <SignUpPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthinticated ? (
              <LoginPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            isAuthinticated && isOnboarded ? (
              <NotificationsPage />
            ) : (
              <Navigate to={!isAuthinticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/chat"
          element={
            isAuthinticated && isOnboarded ? (
              <ChatPage />
            ) : (
              <Navigate to={!isAuthinticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/call"
          element={
            isAuthinticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthinticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/onboarding"
          element={
            isAuthinticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
