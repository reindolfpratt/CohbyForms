import { Organization, Prisma } from "@prisma/client";
import { cache as reactCache } from "react";
import { prisma } from "@formbricks/database";
import { DatabaseError, ResourceNotFoundError } from "@formbricks/types/errors";

export const getOrganizationIdFromEnvironmentId = reactCache(
  async (environmentId: string): Promise<string> => {
    const organization = await prisma.organization.findFirst({
      where: {
        projects: {
          some: {
            environments: {
              some: { id: environmentId },
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!organization) {
      throw new ResourceNotFoundError("Organization", null);
    }

    return organization.id;
  }
);

export const getOrganizationAIKeys = reactCache(
  async (
    organizationId: string
  ): Promise<Pick<Organization, "isAIEnabled" | "billing" | "aiConfig"> | null> => {
    try {
      const organization = await prisma.organization.findUnique({
        where: {
          id: organizationId,
        },
        select: {
          isAIEnabled: true,
          billing: true,
          aiConfig: true,
        },
      });

      if (organization) {
        const org = organization as any;
        const isFreePlan = org.billing?.plan === "free";

        return {
          ...org,
          isAIEnabled: !isFreePlan,
        };
      }

      return null;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // If the AI columns are missing (migration not yet run), return safe defaults
        if (
          error.code === "P2011" ||
          error.code === "P2025" ||
          error.code === "P2022" ||
          error.code === "P1009" ||
          error.message.includes("isAIEnabled") ||
          error.message.includes("aiConfig")
        ) {
          const org = await prisma.organization.findUnique({
            where: { id: organizationId },
            select: { billing: true },
          });
          if (!org) return null;
          return {
            isAIEnabled: false,
            billing: org.billing,
            aiConfig: { providers: [] },
          } as any;
        }
        throw new DatabaseError(error.message);
      }

      // Catch any other error that might occur if the column doesn't exist in DB yet.
      if (
        error instanceof Error &&
        (error.message.includes("isAIEnabled") ||
          error.message.includes("aiConfig") ||
          error.message.includes("Unknown column"))
      ) {
        const org = await prisma.organization.findUnique({
          where: { id: organizationId },
          select: { billing: true },
        });
        if (!org) return null;
        return {
          isAIEnabled: false,
          billing: org.billing,
          aiConfig: { providers: [] },
        } as any;
      }

      throw error;
    }
  }
);
