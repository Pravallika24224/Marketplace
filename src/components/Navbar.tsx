"use client";

import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import LogoutButton from "./LogoutButton";
import Link from "next/link";

const Navbar = () => {
  const { user, loading } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (loading) {
    return (
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between">
        <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
        <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
      </nav>
    );
  }
  const commonButtonStyles =
    "text-white px-4 py-2 bg-green-600 rounded-md hover:bg-green-700 mr-4";

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between">
      <Link href="/" className="text-2xl font-bold text-blue-600">
        Marketplace
      </Link>
      <button
        className="md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle Menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>
      <div className="hidden md:flex items-center px-4">
        {!user ? (
          <>
            <Link href="/auth/login" className={commonButtonStyles}>
              Login
            </Link>
            <Link href="/auth/signup" className={commonButtonStyles}>
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link href="/profile">
              <div
                className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition mr-4"
                aria-label="Profile"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  />
                </svg>
              </div>
            </Link>
            <Link href="/sell" className={commonButtonStyles}>
              List your Company
            </Link>
            <LogoutButton />
          </>
        )}
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 right-0 bg-white shadow-md w-full p-4">
          {!user ? (
            <>
              <Link href="/auth/login" className="block py-2">
                Login
              </Link>
              <Link href="/auth/signup" className="block py-2">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link href="/profile" className="block py-2">
                Profile
              </Link>
              <Link href="/sell" className="block py-2">
                List your Company
              </Link>
              <LogoutButton />
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
