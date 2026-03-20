"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  async function handleSignup() {
    const { error } = await signUp(email, password);

    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful! Check your email.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-6">Signup</h1>

      <div className="space-y-4 w-[350px]">

        {/* Email */}
        <div className="flex items-center gap-0">
          <label className="w-24 text-sm font-medium text-gray-700">
            Email
          </label>

          <input
            type="email"
            placeholder="Email"
            className="border p-2 flex-1 rounded"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="flex items-center gap-0">
          <label className="w-24 text-sm font-medium text-gray-700">
            Password
          </label>

          <div className="relative flex-1">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="border p-2 w-full rounded"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleSignup}
          className="bg-blue-900 text-white w-full py-2 rounded mt-4"
        >
          Signup
        </button>

      </div>
    </div>
  );
}