"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
export default function ContributePage() {
    const router = useRouter();
    const [step, setStep] = useState("request");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [demoCode, setDemoCode] = useState(null);
    const handleRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const res = await fetch(`${API_URL}/resources/request-contributor`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            if (!res.ok) {
                throw new Error("Failed to request verification");
            }
            const data = await res.json();
            setSuccess("Verification code sent! Check your email or use the code below.");
            setStep("verify");
            //if fetch fiald
            if (data.demo?.code) {
                setDemoCode(data.demo.code);
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        }
        finally {
            setLoading(false);
        }
    };
    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API_URL}/resources/verify-contributor`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code })
            });
            if (!res.ok) {
                throw new Error("Invalid or expired code");
            }
            setSuccess(" Email verified! You can now add content to the platform.");
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Verification failed");
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Become a Content Contributor
        </h1>

        {step === "request" ? (<>
            <p className="text-gray-600 text-center mb-6">
              Request access to add learning resources to our platform. We'll
              send you a verification code via email.
            </p>

            <form onSubmit={handleRequest} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="your@email.com"/>
              </div>

              {error && (<div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>)}

              {success && (<div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                  {success}
                </div>)}

              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                {loading ? "Sending..." : "Request Verification Code"}
              </button>
            </form>

            {demoCode && (<div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 font-semibold mb-1">
                  Demo Mode - Verification Code:
                </p>
                <p className="text-lg font-mono text-yellow-900">{demoCode}</p>
              </div>)}
          </>) : (<>
            <p className="text-gray-600 text-center mb-6">
              Enter the verification code sent to <strong>{email}</strong>
            </p>

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input id="code" type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required maxLength={6} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest" placeholder="000000"/>
              </div>

              {error && (<div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>)}

              {success && (<div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                  {success}
                </div>)}

              <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                {loading ? "Verifying..." : "Verify Code"}
              </button>

              <button type="button" onClick={() => {
                setStep("request");
                setCode("");
                setError("");
                setDemoCode(null);
            }} className="w-full text-blue-600 hover:text-blue-700 font-medium py-2 px-4">
                Change Email
              </button>
            </form>
          </>)}

        <div className="mt-6 text-center">
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>);
}
