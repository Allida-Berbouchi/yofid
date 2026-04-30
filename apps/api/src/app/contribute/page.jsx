"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function ContributePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await apiFetch("/api/users/request-creator", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      if (!result.ok) {
        throw new Error(result.data?.message || "Failed to request creator access");
      }
      localStorage.setItem("creator", "true");
      setSuccess("Creator access requested successfully. Your account can now submit content.");
      setTimeout(() => {
        router.push("/submit");
      }, 1600);
    } catch (err) {
      setError(err?.message || "Failed to request creator access");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Become a Content Contributor
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Request creator access on your account so you can publish learning resources.
        </p>

        <form onSubmit={handleRequest} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            {loading ? "Requesting..." : "Request Creator Access"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
