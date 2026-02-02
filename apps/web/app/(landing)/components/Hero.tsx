"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const FloatingCard = ({ className, delay }: { className?: string; delay: number }) => (
  <div
    className={`animate-float absolute rounded-2xl bg-white p-6 shadow-2xl ${className}`}
    style={{ animationDelay: `${delay}s` }}>
    <div className="w-48 space-y-3">
      <div className="h-3 w-3/4 rounded-full bg-gradient-to-r from-teal-400 to-blue-500" />
      <div className="h-2 w-full rounded-full bg-slate-200" />
      <div className="h-2 w-2/3 rounded-full bg-slate-200" />
      <div className="mt-4 flex gap-2">
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-400 to-blue-500" />
        <div className="flex-1 space-y-1">
          <div className="h-2 w-1/2 rounded-full bg-slate-200" />
          <div className="h-2 w-3/4 rounded-full bg-slate-100" />
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
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-teal-50/30 to-blue-50/50">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-pulse-slow absolute -right-1/2 -top-1/2 h-full w-full rounded-full bg-gradient-to-bl from-teal-200/20 to-transparent blur-3xl" />
        <div
          className="animate-pulse-slow absolute -bottom-1/2 -left-1/2 h-full w-full rounded-full bg-gradient-to-tr from-blue-200/20 to-transparent blur-3xl"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Floating Form Cards */}
      <FloatingCard className="left-[10%] top-1/4 hidden lg:block" delay={0} />
      <FloatingCard className="right-[8%] top-1/3 hidden lg:block" delay={0.5} />
      <FloatingCard className="bottom-1/4 left-[15%] hidden lg:block" delay={1} />

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-24 text-center">
        {/* Badge */}
        <div className="animate-on-scroll mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 opacity-0 backdrop-blur-sm">
          <span className="flex h-2 w-2 animate-pulse rounded-full bg-teal-500" />
          <span className="text-sm font-medium text-slate-600">AI-Powered Form Builder</span>
        </div>

        {/* Headline */}
        <h1 className="animate-on-scroll mb-6 text-5xl font-bold leading-tight text-slate-900 opacity-0 md:text-7xl">
          Build forms that{" "}
          <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
            people love
          </span>{" "}
          to fill
        </h1>

        {/* Subheadline */}
        <p className="animate-on-scroll mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-slate-600 opacity-0 md:text-2xl">
          Create beautiful, conversational forms that feel like a chat. Get 3x more responses with
          <span className="font-semibold text-slate-800"> CohbyForm</span>&apos;s intelligent design.
        </p>

        {/* CTA Buttons */}
        <div className="animate-on-scroll mb-16 flex flex-col items-center justify-center gap-4 opacity-0 sm:flex-row">
          <Link
            href="/auth/login"
            className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-teal-500/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-500/30">
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
            className="flex items-center gap-2 font-medium text-slate-600 transition-colors hover:text-slate-900">
            See how it works
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
        </div>

        {/* Social Proof */}
        <div className="animate-on-scroll flex flex-col items-center gap-4 opacity-0">
          <p className="text-sm text-slate-500">Trusted by innovative teams</p>
          <div className="flex items-center gap-8 opacity-60">
            <div className="h-8 w-24 rounded bg-slate-300" />
            <div className="h-8 w-28 rounded bg-slate-300" />
            <div className="h-8 w-20 rounded bg-slate-300" />
            <div className="h-8 w-24 rounded bg-slate-300" />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};
