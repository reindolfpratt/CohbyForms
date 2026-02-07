"use client";

import Link from "next/link";
import { Logo } from "@/modules/ui/components/logo";

interface FormWrapperProps {
  children: React.ReactNode;
}

export const FormWrapper = ({ children }: FormWrapperProps) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="animate-gradient-shift absolute inset-0 bg-gradient-to-br from-[#0a1551] via-[#1e3a5f] to-[#00C4B8]" />

      {/* Floating decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Floating circles */}
        <div className="animate-float-slow absolute left-10 top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="animate-float-medium absolute bottom-32 right-20 h-96 w-96 rounded-full bg-[#00C4B8]/10 blur-3xl" />
        <div className="animate-float-fast absolute left-1/3 top-1/2 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

        {/* Geometric shapes */}
        <div className="animate-spin-slow absolute right-1/4 top-32 h-20 w-20 rotate-45 border-2 border-white/10" />
        <div className="animate-pulse-slow absolute bottom-40 left-1/4 h-16 w-16 rounded-full border-2 border-[#00C4B8]/20" />
        <div className="animate-bounce-slow absolute right-10 top-1/3 h-12 w-12 rotate-12 bg-white/5" />
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto flex min-h-screen flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        {/* Glassmorphism Card */}
        <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <Logo className="mx-auto w-48" />
            </Link>
          </div>

          {/* Form content */}
          {children}
        </div>

        {/* Bottom decorative text */}
        <p className="mt-8 text-center text-sm text-white/60">Secure • Simple • Powerful</p>
      </div>

      {/* Inline styles for animations */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-30px) translateX(15px);
          }
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(25px) translateX(-20px);
          }
        }
        .animate-float-medium {
          animation: float-medium 8s ease-in-out infinite;
        }
        @keyframes float-fast {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(20px) translateX(10px);
          }
        }
        .animate-float-fast {
          animation: float-fast 5s ease-in-out infinite;
        }
        @keyframes spin-slow {
          0% {
            transform: rotate(45deg);
          }
          100% {
            transform: rotate(405deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.1);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: rotate(12deg) translateY(0);
          }
          50% {
            transform: rotate(12deg) translateY(-15px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
