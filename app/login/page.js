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
  const router = useRouter();

  async function handleLogin() {
    const { error } = await login(email, password);

    if (error) {
      alert(error.message);
    } else {
      router.push("/dashboard"); // 🚀 redirect on success
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700">

      <div className="bg-white w-[380px] p-8 rounded-2xl shadow-xl">

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Login to your account
        </p>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-600">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
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
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-10 text-gray-500 cursor-pointer"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition cursor-pointer"
        >
          Login
        </button>

        {/* Extra Links */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-700 cursor-pointer hover:underline">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}