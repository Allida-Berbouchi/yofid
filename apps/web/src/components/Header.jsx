"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth";
export default function Header({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        setIsLoggedIn(!!getAccessToken());
    }, []);
    return (<header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-blue-600">Yovid</span>
          <span className="text-sm text-gray-600">Learning Hub</span>
        </Link>

        <div className="flex gap-4 items-center">
          <Link href="/" className="nav-link font-medium">
            Home
          </Link>
          <Link href="/search" className="nav-link font-medium">
            Search
          </Link>
          <Link href="/dashboard" className="nav-link font-medium">
            Dashboard
          </Link>
          <Link href="/submit" className="nav-link font-medium">
            Submit Resource
          </Link>
          {!isLoggedIn && (<Link href="/login" className="btn-primary text-sm">
              Login
            </Link>)}
        </div>
      </nav>
      {children}
    </header>);
}
