"use client";

import { SparklesIcon } from "lucide-react";
import { useState } from "react";
import { TTemplate } from "@formbricks/types/templates";
import { cn } from "@/lib/cn";
import { AIBuilderModal } from "@/modules/ai/components/ai-builder-modal";

interface AIBuilderTemplateProps {
  environmentId: string;
  onTemplateClick: (template: TTemplate) => void;
  setActiveTemplate: (template: TTemplate) => void;
}

export const AIBuilderTemplate = ({
  environmentId,
  onTemplateClick,
  setActiveTemplate,
}: AIBuilderTemplateProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerated = (template: TTemplate) => {
    setActiveTemplate(template);
    onTemplateClick(template);
  };

  const cardClass = cn(
    "hover:border-brand-dark border-dashed border-slate-300",
    "flex flex-col group relative rounded-lg border-2 bg-transparent p-6 transition-colors duration-120 duration-150"
  );

  return (
    <>
      <button type="button" className={cardClass} onClick={() => setIsModalOpen(true)}>
        <SparklesIcon className="text-brand-dark h-8 w-8 transition-all duration-150 group-hover:scale-110" />
        <h3 className="text-md mb-1 mt-3 text-left font-bold text-slate-700">Build with AI</h3>
        <p className="text-left text-xs text-slate-600">
          Describe your survey and let AI do the heavy lifting.
        </p>
      </button>

      <AIBuilderModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        environmentId={environmentId}
        onGenerated={handleGenerated}
      />
    </>
  );
};
