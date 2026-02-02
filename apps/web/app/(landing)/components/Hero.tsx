"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

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
    <>
      {/* Dark Purple Hero Section */}
      <section
        ref={heroRef}
        className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden bg-[#1a1625] pb-16 pt-24">
        {/* Main Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          {/* Badge */}
          <div className="animate-on-scroll mb-6 inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-900/30 px-4 py-2 opacity-0 backdrop-blur-sm">
            <span className="text-xs font-medium uppercase tracking-wider text-purple-300">
              Engagement Platform
            </span>
          </div>

          {/* Headline - Elegant Serif Font Style */}
          <h1 className="animate-on-scroll mb-6 font-serif text-5xl font-normal leading-tight text-white opacity-0 md:text-6xl lg:text-7xl">
            Build forms at the
            <br />
            <span className="italic">drop of a click</span>
          </h1>

          {/* Subheadline */}
          <p className="animate-on-scroll mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-purple-200/80 opacity-0">
            Put a seasoned form expert to work with CohbyForm. It structures and designs at your command. Just
            click to build and edit.
          </p>

          {/* CTA Button */}
          <div className="animate-on-scroll mb-8 flex flex-col items-center justify-center gap-4 opacity-0">
            <Link
              href="/auth/login"
              className="rounded-full border-2 border-white/80 bg-transparent px-8 py-3 text-base font-medium text-white transition-all duration-300 hover:bg-white hover:text-[#1a1625]">
              See plans
            </Link>
          </div>
        </div>
      </section>

      {/* Light Section with Device Mockup */}
      <section className="relative bg-gradient-to-b from-[#f5f0f0] to-white py-16">
        <div className="mx-auto max-w-5xl px-6">
          {/* Device Mockup */}
          <div className="animate-on-scroll relative mx-auto opacity-0">
            <div className="relative mx-auto max-w-3xl">
              {/* Tablet Frame */}
              <div className="relative overflow-hidden rounded-[2.5rem] border-[12px] border-slate-800 bg-slate-800 shadow-2xl">
                {/* Screen Content */}
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                  {/* Mock Form Content */}
                  <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                    <p className="mb-4 text-xs uppercase tracking-widest text-slate-400">Success!</p>
                    <h2 className="mb-6 text-3xl font-light text-white md:text-4xl">
                      Thanks for
                      <br />
                      <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                        your response
                      </span>
                    </h2>
                    <button className="rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 px-6 py-3 text-sm font-medium text-white">
                      Continue exploring
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative hands holding tablet - using CSS shapes */}
              <div className="absolute -bottom-4 -left-8 h-24 w-24 rounded-full bg-[#f5f0f0]" />
              <div className="absolute -bottom-4 -right-8 h-24 w-24 rounded-full bg-[#f5f0f0]" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
