"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { prisma } from "@formbricks/database";
import { AuthorizationError } from "@formbricks/types/errors";
import { TOrganizationAIConfig } from "@formbricks/types/organizations";
import { authOptions } from "@/modules/auth/lib/authOptions";
import { encryptAIConfig } from "./lib/crypto";

export const updateOrganizationAISettingsAction = async (
  organizationId: string,
  isAIEnabled: boolean,
  aiConfig: TOrganizationAIConfig
) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new AuthorizationError("You must be logged in to use this feature.");
  }

  // Check if user has permission to update organization settings
  const membership = await prisma.membership.findFirst({
    where: {
      userId: session.user.id,
      organizationId,
      role: { in: ["owner", "manager"] },
    },
  });

  if (!membership) {
    throw new AuthorizationError("You do not have permission to update organization settings.");
  }

  // Encrypt sensitive API keys
  const encryptedConfig = encryptAIConfig(aiConfig);

  await prisma.organization.update({
    where: { id: organizationId },
    data: {
      isAIEnabled,
      aiConfig: encryptedConfig as any,
    },
  });

  revalidatePath("/(app)/environments/[environmentId]/settings", "layout");
};
