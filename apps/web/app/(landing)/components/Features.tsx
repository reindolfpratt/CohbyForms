"use client";

import { useEffect, useRef } from "react";

const features = [
  {
    title: "Multi-Language",
    description:
      "Reach global audiences with forms in any language. Auto-translate or customize translations.",
  },
  {
    title: "Real-time Analytics",
    description: "Track responses as they come in. Visualize data with beautiful charts and export anytime.",
  },
  {
    title: "Advanced Logic",
    description: "Create dynamic forms with conditional branching. Show questions based on previous answers.",
  },
  {
    title: "Integrations",
    description: "Connect with Salesforce, Slack, Notion, and 100+ tools. Automate your workflow.",
  },
  {
    title: "Save & Resume",
    description: "Let respondents save progress and continue later. Never lose a partial submission.",
  },
];

export const Features = () => {
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
    <section id="features" ref={sectionRef} className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="animate-on-scroll mb-4 text-4xl font-bold text-slate-900 opacity-0 md:text-5xl">
            Everything you need to collect data
          </h2>
          <p className="animate-on-scroll mx-auto max-w-2xl text-xl text-slate-600 opacity-0">
            Powerful features wrapped in a beautiful, intuitive interface
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="animate-on-scroll group rounded-2xl border border-slate-200 bg-white p-8 opacity-0 transition-all duration-300 hover:border-slate-300 hover:shadow-lg"
              style={{ transitionDelay: `${index * 100}ms` }}>
              {/* Content */}
              <h3 className="mb-3 text-xl font-bold text-slate-900">{feature.title}</h3>
              <p className="leading-relaxed text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
