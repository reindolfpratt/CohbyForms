"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const FloatingCard = ({ className, delay }: { className?: string; delay: number }) => (
  <div
    className={`animate-float absolute rounded-2xl bg-white/10 p-6 shadow-2xl backdrop-blur-sm ${className}`}
    style={{ animationDelay: `${delay}s` }}>
    <div className="w-48 space-y-3">
      <div className="h-3 w-3/4 rounded-full bg-white/30" />
      <div className="h-2 w-full rounded-full bg-white/20" />
      <div className="h-2 w-2/3 rounded-full bg-white/20" />
      <div className="mt-4 flex gap-2">
        <div className="h-8 w-8 rounded-full bg-white/25" />
        <div className="flex-1 space-y-1">
          <div className="h-2 w-1/2 rounded-full bg-white/20" />
          <div className="h-2 w-3/4 rounded-full bg-white/15" />
        </div>
      </div>
    </div>
  </div>
);

export const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = heroRef.current?.querySelectorAll(".animate-on-scroll");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#1a1625]">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-pulse-slow absolute -right-1/2 -top-1/2 h-full w-full rounded-full bg-gradient-to-bl from-purple-900/30 to-transparent blur-3xl" />
        <div
          className="animate-pulse-slow absolute -bottom-1/2 -left-1/2 h-full w-full rounded-full bg-gradient-to-tr from-indigo-900/30 to-transparent blur-3xl"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Floating Form Cards */}
      <FloatingCard className="left-[10%] top-1/4 hidden lg:block" delay={0} />
      <FloatingCard className="right-[8%] top-1/3 hidden lg:block" delay={0.5} />
      <FloatingCard className="bottom-1/4 left-[15%] hidden lg:block" delay={1} />

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-24 text-center">
        {/* Headline */}
        <h1 className="animate-on-scroll mb-6 text-5xl font-bold leading-tight text-white opacity-0 md:text-7xl">
          Build forms that people love to fill
        </h1>

        {/* Subheadline */}
        <p className="animate-on-scroll mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-white/70 opacity-0 md:text-2xl">
          Create beautiful, conversational forms that feel like a chat. Get 3x more responses with
          CohbyForms&apos; intelligent design.
        </p>

        {/* CTA Buttons */}
        <div className="animate-on-scroll mb-16 flex flex-col items-center justify-center gap-4 opacity-0 sm:flex-row">
          <Link
            href="/auth/login"
            className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-[#1a1625] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            Get Started Free
            <svg
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
          <Link
            href="#features"
            className="flex items-center gap-2 font-medium text-white/70 transition-colors hover:text-white">
            See how it works
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
        </div>

        {/* Social Proof */}
        <div className="animate-on-scroll flex flex-col items-center gap-4 opacity-0">
          <p className="text-sm text-white/50">Trusted by innovative teams</p>
          <div className="flex items-center gap-8 opacity-40">
            <div className="h-8 w-24 rounded bg-white/20" />
            <div className="h-8 w-28 rounded bg-white/20" />
            <div className="h-8 w-20 rounded bg-white/20" />
            <div className="h-8 w-24 rounded bg-white/20" />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="h-6 w-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};
