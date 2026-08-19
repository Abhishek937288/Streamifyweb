import React, { useState } from "react";
import useLogin from "../hooks/useLogin.js";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";
import { useThemeStore } from "../store/useThemeStore.js";
import ThemeSelector from "../components/ThemeSelector.jsx";

const LoginPage = () => {
  const { isPending, error, loginMutation } = useLogin();
  const { theme } = useThemeStore();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-8"
      data-theme={theme}
    >
      <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-base-300">
        {/* LOGIN FORM SECTION */}
        <div className="w-full lg:w-1/2 p-8 sm:p-10 lg:p-12 flex flex-col">
          {/* LOGO */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center justify-start gap-2.5">
              <ShipWheelIcon className="size-8 text-primary" />
              <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide">
                Streamify
              </span>
            </div>
            <ThemeSelector />
          </div>

          {/* ERROR MESSAGE DISPLAY */}
          {error && (
            <div className="alert alert-error mb-6 rounded-lg">
              <span className="text-sm">{error?.response?.data?.message || error?.message || "Something went wrong"}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleLogin}>
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-base-content mb-1">Welcome Back</h2>
                  <p className="text-sm text-base-content/60">
                    Sign in to continue your language learning journey
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="form-control w-full">
                    <label className="label py-1.5">
                      <span className="label-text font-medium text-sm text-base-content/80">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="hello@example.com"
                      className="input input-bordered w-full h-11 rounded-lg focus:input-primary transition-colors"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label py-1.5">
                      <span className="label-text font-medium text-sm text-base-content/80">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="input input-bordered w-full h-11 rounded-lg focus:input-primary transition-colors"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full h-11 rounded-lg font-semibold text-base mt-1"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <p className="text-sm text-base-content/60">
                      Don't have an account?{" "}
                      <Link
                        to="/signup"
                        className="text-primary font-semibold hover:underline"
                      >
                        Create one
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* IMAGE SECTION */}
        <div className="hidden lg:flex w-full lg:w-1/2 relative items-center justify-center overflow-hidden bg-primary/10">
          <img
            src="/i.png"
            alt="Language connection illustration"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="relative z-10 text-center space-y-3 p-10">
            <h2 className="text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Connect with language partners worldwide
            </h2>
            <p className="text-sm text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] leading-relaxed max-w-sm mx-auto">
              Practice conversations, make friends, and improve your language skills together
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;