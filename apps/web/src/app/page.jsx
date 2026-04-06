"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import CardPreview from "@/components/CardPreview";
import SearchBar from "@/components/SearchBar";
import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
export default function HomePage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const fetchResources = async (query = "") => {
        try {
            const endpoint = query ? `/resources?q=${encodeURIComponent(query)}` : "/resources?limit=20";
            const data = await apiFetch(endpoint);
            setItems(data.items || []);
        }
        catch (e) {
            setErr(e.message);
            setItems([
                {
                    _id: "demo1",
                    title: "Introduction to React",
                    type: "video",
                    moduleId: "module1",
                    status: "approved",
                    description: "Learn React fundamentals",
                    sourceUrl: "https://example.com/react.mp4"
                },
                {
                    _id: "demo2",
                    title: "TypeScript Handbook",
                    type: "pdf",
                    moduleId: "module2",
                    status: "approved",
                    description: "Complete guide to TypeScript"
                },
                {
                    _id: "demo3",
                    title: "Web Development Basics",
                    type: "text",
                    moduleId: "module1",
                    status: "approved",
                    description: "Master the basics of web development"
                }
            ]);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        setIsLoggedIn(!!getAccessToken());
        fetchResources();
    }, []);
    return (<>
      <Header>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4 text-center">
          <h1 className="text-5xl font-bold mb-3">Yovid</h1>
          <p className="text-xl text-blue-100 mb-2">Discover and Share Educational Resources</p>
          <p className="text-blue-100">Find videos, PDFs, links, and more from our community</p>
        </div>
      </Header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <SearchBar onSearch={fetchResources}/>

        {err && (<div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
            {err} - Showing demo resources
          </div>)}

        {loading ? (<div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading resources...</p>
          </div>) : (<>
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Resources</h2>
              <p className="text-gray-600 mb-6">Showing {items.length} resource{items.length !== 1 ? "s" : ""}</p>

              {items.length === 0 ? (<div className="card p-8 text-center">
                  <p className="text-gray-500 text-lg mb-4">No resources available yet.</p>
                  <Link href="/register" className="btn-primary inline-block">
                    Register and Add Resources
                  </Link>
                </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((resource) => (<CardPreview key={resource._id} resource={resource}/>))}
                </div>)}
            </div>

            {!isLoggedIn && (<div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Get Started</h3>
                <p className="text-gray-700 mb-6">
                  Want to share educational resources? Create an account and start contributing to the community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register" className="btn-primary">
                    Create Account
                  </Link>
                  <Link href="/login" className="btn-secondary">
                    Sign In
                  </Link>
                </div>
              </div>)}
          </>)}
      </main>
    </>);
}
