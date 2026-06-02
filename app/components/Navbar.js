"use client";

import { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef();
  const router = useRouter();

  // 🔥 Get user session
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // 🔥 Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-gray-950/80 border-b border-gray-800 text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <h1 className="text-xl sm:text-2xl font-bold cursor-pointer">
          Kante<span className="text-blue-500">Exchange</span>
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/">Home</Link>
          <Link href="/markets">Markets</Link>
          <Link href="/exchange">Exchange</Link>
          <Link href="/calculator">Calculator</Link>
        </ul>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">

          {!user ? (
            <>
              <Link href="/login" className="px-4 py-2 border border-gray-700 rounded-lg">
                Login
              </Link>
              <Link href="/signup" className="btn-primary">
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>

              {/* Trigger */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
              >
                <FaUserCircle className="text-xl" />
                <span className="text-sm hidden lg:block">
                  {user.email}
                </span>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg overflow-hidden">

                  <Link
                    href="/dashboard"
                    className="block px-4 py-3 hover:bg-gray-100 text-sm"
                  >
                    Dashboard
                  </Link>

                  <button
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
                  >
                    Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-500 hover:bg-gray-100 text-sm"
                  >
                    Logout
                  </button>

                </div>
              )}

            </div>
          )}

        </div>

        {/* Mobile Toggle */}
        <div
          className="md:hidden text-xl cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 px-6 pb-6">
          <ul className="flex flex-col gap-5 text-sm">

            <Link href="/">Home</Link>
            <Link href="/markets">Markets</Link>
            <Link href="/exchange">Exchange</Link>
            <Link href="/calculator">Calculator</Link>

            {!user ? (
              <div className="flex gap-3 pt-2">
                <Link href="/login" className="flex-1 border py-2 rounded-lg text-center">
                  Login
                </Link>
                <Link href="/signup" className="flex-1 btn-primary text-center">
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <Link href="/dashboard" className="border py-2 rounded-lg text-center">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 py-2 rounded-lg"
                >
                  Logout
                </button>
              </div>
            )}

          </ul>
        </div>
      )}

    </nav>
  );
}