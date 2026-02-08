"use client";

import { useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import { updateOrganizationTierAction } from "../actions";

interface TierDropdownProps {
  organizationId: string;
  currentPlan: string;
}

const PLAN_OPTIONS = [
  { value: "free", label: "Free", color: "text-slate-600" },
  { value: "startup", label: "Startup", color: "text-blue-600" },
  { value: "custom", label: "Custom", color: "text-purple-600" },
] as const;

export const TierDropdown = ({ organizationId, currentPlan }: TierDropdownProps) => {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPlan = e.target.value as "free" | "startup" | "custom";
    setSelectedPlan(newPlan);

    startTransition(async () => {
      try {
        await updateOrganizationTierAction(organizationId, newPlan);
        toast.success(`Plan updated to ${newPlan}`);
      } catch (error) {
        console.error("Failed to update tier:", error);
        setSelectedPlan(currentPlan); // Revert on error
        toast.error("Failed to update plan");
      }
    });
  };

  return (
    <select
      value={selectedPlan}
      onChange={handleChange}
      disabled={isPending}
      className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50">
      {PLAN_OPTIONS.map((option) => (
        <option key={option.value} value={option.value} className={option.color}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
