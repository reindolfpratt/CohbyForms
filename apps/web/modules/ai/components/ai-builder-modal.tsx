"use client";

import { SparklesIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { TTemplate } from "@formbricks/types/templates";
import { generateSurveyAction } from "@/modules/ai/actions";
import { Button } from "@/modules/ui/components/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/modules/ui/components/dialog";

interface AIBuilderModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  environmentId: string;
  onGenerated: (template: TTemplate) => void;
}

export const AIBuilderModal = ({ open, setOpen, environmentId, onGenerated }: AIBuilderModalProps) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description for your survey.");
      return;
    }

    setLoading(true);
    try {
      const template = await generateSurveyAction(environmentId, prompt);
      onGenerated(template);
      setOpen(false);
      toast.success("Survey generated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate survey. Please check your AI keys.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SparklesIcon className="text-brand-dark h-5 w-5" />
            Build with AI
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="mb-4 text-sm text-slate-500">
            Describe the survey you want to build, and our AI will create a draft for you.
          </p>
          <textarea
            className="focus:border-brand-dark min-h-[150px] w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="e.g., A customer satisfaction survey for a coffee shop with 5 questions about service, quality, and atmosphere."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button loading={loading} onClick={handleGenerate}>
            Generate Survey
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
