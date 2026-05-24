"use client";

import { useState } from "react";
import { login } from "@/lib/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  async function handleLogin() {
    setLoading(true);
    setErrorMsg("");

    const { error } = await login(email, password);

    if (error) {
      if (error.message.toLowerCase().includes("invalid")) {
        setErrorMsg("Invalid email or password");
      } else {
        setErrorMsg(error.message);
      }
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE (Branding) */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-blue-900 to-black text-white p-10">
        <h1 className="text-4xl font-bold mb-4">
          Welcome Back
        </h1>
        <p className="text-gray-300 text-center max-w-sm">
          Access your account securely and continue managing your finances with confidence.
        </p>
      </div>

      {/* RIGHT SIDE (Form) */}
      <div className="flex items-center justify-center w-full md:w-1/2 bg-gray-100">
        
        <div className="bg-white w-[380px] p-8 rounded-2xl shadow-lg">

          {/* Title */}
          <h2 className="text-2xl font-semibold mb-2">
            Sign In
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            Enter your credentials to continue
          </p>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
              {errorMsg}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm mb-1 text-gray-600">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label className="block text-sm mb-1 text-gray-600">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-right mb-4">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-800 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-black transition font-medium disabled:bg-gray-400"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Signup Link */}
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-800 font-medium hover:underline"
            >
              Create account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}