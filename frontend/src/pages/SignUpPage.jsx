import React, { useState } from "react";
import { ShipWheel } from "lucide-react";
import { Link } from "react-router";
import useSignUp from "../hooks/useSignUp.js";
import { useThemeStore } from "../store/useThemeStore.js";
import ThemeSelector from "../components/ThemeSelector.jsx";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { isPending, error, signupMutation } = useSignUp();
  const { theme } = useThemeStore();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-8"
      data-theme={theme}
    >
      <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-base-300">
        {/* left side*/}
        <div className="w-full lg:w-1/2 p-8 sm:p-10 lg:p-12 flex flex-col">
          {/* logo*/}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center justify-start gap-2.5">
              <ShipWheel className="size-8 text-primary" />
              <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide">
                Streamify
              </span>
            </div>
            <ThemeSelector />
          </div>

          {/* Error message*/}
          {error && (
            <div className="alert alert-error mb-6 rounded-lg">
              <span className="text-sm">{error?.response?.data?.message || error?.message || "Something went wrong"}</span>
            </div>
          )}
          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-base-content mb-1">Create an Account</h2>
                  <p className="text-sm text-base-content/60">
                    Join Streamify and start your language learning adventure!
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="form-control w-full">
                    <label className="label py-1.5">
                      <span className="label-text font-medium text-sm text-base-content/80">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Abhi Man..."
                      className="input input-bordered w-full h-11 rounded-lg focus:input-primary transition-colors"
                      value={signupData.fullName}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          fullName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label py-1.5">
                      <span className="label-text font-medium text-sm text-base-content/80">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="input input-bordered w-full h-11 rounded-lg focus:input-primary transition-colors"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          email: e.target.value,
                        })
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
                      placeholder="Min. 6 characters"
                      className="input input-bordered w-full h-11 rounded-lg focus:input-primary transition-colors"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <p className="text-xs text-base-content/50 mt-1.5">
                      Must be at least 6 characters long
                    </p>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2.5 py-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm checkbox-primary rounded"
                        required
                      />
                      <span className="text-xs text-base-content/70 leading-snug">
                        I agree to the{" "}
                        <span className="text-primary font-medium hover:underline cursor-pointer">
                          Terms of Service
                        </span>{" "}
                        and{" "}
                        <span className="text-primary font-medium hover:underline cursor-pointer">
                          Privacy Policy
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
                <button className="btn btn-primary w-full h-11 rounded-lg font-semibold text-base" type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
                <div className="text-center pt-1">
                  <p className="text-sm text-base-content/60">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary font-semibold hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* right side */}
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

export default SignUpPage;