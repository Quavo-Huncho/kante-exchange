"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignup() {
    setLoading(true);
    const { error } = await signUp(email, password);

    if (error) {
      alert(error.message);
    } else {
      router.push("/login");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* LEFT SIDE (Branding) */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-blue-900 to-black text-white p-10">
        <h1 className="text-4xl font-bold mb-4">
          Your Finance, Simplified
        </h1>
        <p className="text-gray-300 text-center max-w-sm">
          Securely manage your money, track assets, and make smarter financial decisions—all in one place.
        </p>
      </div>

      {/* RIGHT SIDE (Form) */}
      <div className="flex items-center justify-center w-full md:w-1/2 bg-gray-100 py-8">

        <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-lg mx-4">

          {/* Title */}
          <h2 className="text-2xl font-semibold mb-2">
            Create Account
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            Start your journey with us
          </p>

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
              placeholder="Minimum 6 characters"
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

          {/* Button */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-800 font-medium hover:underline">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}