"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { TOrganizationAIConfig } from "@formbricks/types/organizations";
import { updateOrganizationAISettingsAction } from "@/modules/ai/settings-actions";
import { Button } from "@/modules/ui/components/button";
import { Input } from "@/modules/ui/components/input";
import { Label } from "@/modules/ui/components/label";
import { Switch } from "@/modules/ui/components/switch";
import { SettingsCard } from "../../components/SettingsCard";

interface AISettingsFormProps {
  organizationId: string;
  environmentId: string;
  initialIsAIEnabled: boolean;
  initialAIConfig: TOrganizationAIConfig;
}

export const AISettingsForm = ({
  organizationId,
  environmentId,
  initialIsAIEnabled,
  initialAIConfig,
}: AISettingsFormProps) => {
  const [isAIEnabled, setIsAIEnabled] = useState(initialIsAIEnabled);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openaiProvider = initialAIConfig.providers.find((p) => p.id === "openai");
  const anthropicProvider = initialAIConfig.providers.find((p) => p.id === "anthropic");
  const googleProvider = initialAIConfig.providers.find((p) => p.id === "google");

  const { register, handleSubmit } = useForm({
    defaultValues: {
      openaiKey: openaiProvider?.apiKey || "",
      anthropicKey: anthropicProvider?.apiKey || "",
      googleKey: googleProvider?.apiKey || "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const providers: any[] = [];
      if (data.openaiKey) {
        providers.push({ id: "openai", apiKey: data.openaiKey });
      }
      if (data.anthropicKey) {
        providers.push({ id: "anthropic", apiKey: data.anthropicKey });
      }
      if (data.googleKey) {
        providers.push({ id: "google", apiKey: data.googleKey });
      }

      await updateOrganizationAISettingsAction(organizationId, isAIEnabled, { providers: providers as any });
      toast.success("AI settings updated successfully.");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-4">
      <SettingsCard
        title="Enable AI Features"
        description="Toggle AI capabilities for this organization. This enables features like building surveys from prompts.">
        <div className="flex items-center space-x-2">
          <Switch id="ai-enabled" checked={isAIEnabled} onCheckedChange={setIsAIEnabled} />
          <Label htmlFor="ai-enabled">{isAIEnabled ? "Enabled" : "Disabled"}</Label>
        </div>
      </SettingsCard>

      <form onSubmit={handleSubmit(onSubmit)}>
        <SettingsCard
          title="AI API Keys"
          description="Enter your API keys for the AI providers you want to use. These keys are encrypted at rest.">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openaiKey">OpenAI API Key (GPT-4o)</Label>
              <Input id="openaiKey" type="password" placeholder="sk-..." {...register("openaiKey")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="anthropicKey">Anthropic API Key (Claude 3.5 Sonnet)</Label>
              <Input
                id="anthropicKey"
                type="password"
                placeholder="sk-ant-..."
                {...register("anthropicKey")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="googleKey">Google AI (Gemini) API Key</Label>
              <Input id="googleKey" type="password" placeholder="AIza..." {...register("googleKey")} />
            </div>

            <div className="pt-2">
              <Button type="submit" size="sm" loading={isSubmitting}>
                Save AI Settings
              </Button>
            </div>
          </div>
        </SettingsCard>
      </form>
    </div>
  );
};
