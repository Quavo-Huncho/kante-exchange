"use client";

import { useState } from "react";
import { forgotPassword } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await forgotPassword(email);

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset link has been sent to your email. Please check your inbox.");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700 px-4">
      <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-xl">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-2">
          Forgot Password
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Enter your email to receive a password reset link
        </p>

        {/* Success Message */}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm mb-1 text-gray-600">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to Login */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Remember your password?{" "}
          <Link href="/login" className="text-blue-700 cursor-pointer hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
