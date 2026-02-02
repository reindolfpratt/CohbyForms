"use client";

import { useEffect, useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Create your form",
    description: "Use AI or our drag-and-drop builder to create beautiful forms in minutes.",
    color: "from-teal-400 to-teal-500",
  },
  {
    number: "02",
    title: "Customize & brand",
    description: "Match your brand with custom colors, fonts, and logos. Make it yours.",
    color: "from-blue-400 to-blue-500",
  },
  {
    number: "03",
    title: "Share & collect",
    description: "Share via link, embed on your site, or send via email. Start collecting responses.",
    color: "from-indigo-400 to-indigo-500",
  },
  {
    number: "04",
    title: "Analyze & act",
    description: "View real-time analytics, export data, and trigger automations.",
    color: "from-violet-400 to-violet-500",
  },
];

export const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);

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

    const elements = sectionRef.current?.querySelectorAll(".animate-on-scroll");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="animate-on-scroll mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 opacity-0">
            <span className="text-sm font-medium text-blue-700">How It Works</span>
          </div>
          <h2 className="animate-on-scroll mb-4 text-4xl font-bold text-slate-900 opacity-0 md:text-5xl">
            From idea to insights in{" "}
            <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
              4 simple steps
            </span>
          </h2>
          <p className="animate-on-scroll mx-auto max-w-2xl text-xl text-slate-600 opacity-0">
            Getting started is easy. Here&apos;s how it works.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="animate-on-scroll relative opacity-0"
              style={{ transitionDelay: `${index * 150}ms` }}>
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-full top-12 hidden h-0.5 w-full bg-gradient-to-r from-slate-200 to-slate-100 lg:block" />
              )}

              {/* Card */}
              <div className="h-full rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl">
                {/* Number */}
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${step.color} mb-6 text-lg font-bold text-white`}>
                  {step.number}
                </div>

                {/* Content */}
                <h3 className="mb-3 text-xl font-bold text-slate-900">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
