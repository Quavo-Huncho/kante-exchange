"use client";

import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-gray-950/80 border-b border-gray-800 text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <h1 className="text-2xl font-bold cursor-pointer">
          Kante<span className="text-blue-500">Exchange</span>
        </h1>
        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="relative group cursor-pointer">
            Home
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-500 transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/markets" className="relative group cursor-pointer">
            Markets
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-500 transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/exchange" className="relative group cursor-pointer">
            Exchange
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-500 transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/calculator" className="relative group cursor-pointer">
            Calculator
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-500 transition-all group-hover:w-full"></span>
          </Link>
        </ul>
        {/* Right Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition cursor-pointer">
            Login
          </Link>
          <Link href="/signup" className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition cursor-pointer">
            Sign Up
          </Link>
        </div>
        {/* Mobile Menu Button */}
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
            <Link href="/" className="cursor-pointer hover:text-blue-400">
              Home
            </Link>
            <Link href="/markets" className="cursor-pointer hover:text-blue-400">
              Markets
            </Link>
            <Link href="/exchange" className="cursor-pointer hover:text-blue-400">
              Exchange
            </Link>
            <Link href="/ExchangeCalculator" className="cursor-pointer hover:text-blue-400">
              Calculator
            </Link>

            <div className="flex gap-3 pt-2">

              <Link href="/login" className="flex-1 border border-gray-700 py-2 rounded-lg">
                Login
              </Link>

              <Link href="/signup" className="flex-1 bg-blue-600 py-2 rounded-lg">
                Sign Up
              </Link>

            </div>

          </ul>

        </div>
      )}

    </nav>
  );
}