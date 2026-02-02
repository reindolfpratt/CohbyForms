"use client";

import Link from "next/link";

export const CTASection = () => {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        {/* Main CTA Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-500 via-teal-600 to-blue-600 p-12 md:p-16">
          {/* Background decorations */}
          <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10">
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Ready to create forms that convert?
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-xl text-teal-100">
              Join thousands of teams using CohbyForm to collect better data and drive results.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/auth/login"
                className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-teal-600 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                Get Started Free
              </Link>
              <Link
                href="/auth/login"
                className="rounded-full border-2 border-white/30 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white/10">
                Watch Demo
              </Link>
            </div>

            <p className="mt-6 text-sm text-teal-200">
              No credit card required • Free forever plan available
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
