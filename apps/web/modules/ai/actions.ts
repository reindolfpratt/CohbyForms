"use server";

import { getServerSession } from "next-auth";
import { AuthorizationError } from "@formbricks/types/errors";
import { TTemplate } from "@formbricks/types/templates";
import { authOptions } from "@/modules/auth/lib/authOptions";
import { getOrganizationIdFromEnvironmentId } from "@/modules/survey/lib/organization";
import { generateSurveyFromPrompt } from "./lib/service";

export const generateSurveyAction = async (
  environmentId: string,
  prompt: string,
  providerId?: "openai" | "anthropic" | "google"
): Promise<TTemplate> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new AuthorizationError("You must be logged in to use this feature.");
  }

  const organizationId = await getOrganizationIdFromEnvironmentId(environmentId);
  if (!organizationId) {
    throw new Error("Organization not found.");
  }

  return await generateSurveyFromPrompt(organizationId, prompt, providerId);
};
