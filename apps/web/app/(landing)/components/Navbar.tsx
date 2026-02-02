"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 shadow-sm backdrop-blur-md" : "bg-[#1a1625]"
      }`}>
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-transparent.png"
              alt="CohbyForm"
              width={140}
              height={40}
              className={`h-10 w-auto transition-all duration-300 ${!scrolled ? "brightness-0 invert" : ""}`}
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className={`font-medium transition-colors ${
                scrolled ? "text-slate-600 hover:text-slate-900" : "text-purple-200/80 hover:text-white"
              }`}>
              Features
            </Link>
            <Link
              href="#how-it-works"
              className={`font-medium transition-colors ${
                scrolled ? "text-slate-600 hover:text-slate-900" : "text-purple-200/80 hover:text-white"
              }`}>
              How It Works
            </Link>
            <Link
              href="#integrations"
              className={`font-medium transition-colors ${
                scrolled ? "text-slate-600 hover:text-slate-900" : "text-purple-200/80 hover:text-white"
              }`}>
              Integrations
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className={`font-medium transition-colors ${
                scrolled ? "text-slate-600 hover:text-slate-900" : "text-purple-200/80 hover:text-white"
              }`}>
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className={`rounded-full px-6 py-2.5 font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                scrolled
                  ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:shadow-lg hover:shadow-teal-500/25"
                  : "border border-white/60 bg-transparent text-white hover:bg-white hover:text-[#1a1625]"
              }`}>
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
