"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { prisma } from "@formbricks/database";
import { authOptions } from "@/modules/auth/lib/authOptions";

// Predefined limits for each billing plan
const PLAN_LIMITS = {
  free: {
    projects: 3,
    monthly: {
      responses: 1500,
      miu: 2000,
    },
  },
  startup: {
    projects: 10,
    monthly: {
      responses: 5000,
      miu: 10000,
    },
  },
  custom: {
    projects: null, // unlimited
    monthly: {
      responses: null, // unlimited
      miu: null, // unlimited
    },
  },
} as const;

type PlanType = keyof typeof PLAN_LIMITS;

export async function verifySuperAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userEmail = (session.user as any)?.email;
  const isSuperAdminEmail = userEmail === "reindolfpratt@gmail.com";

  if (isSuperAdminEmail) {
    return true;
  }

  // Fallback to DB role check
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  // @ts-ignore - Prisma types may not be fully recognized
  if (user?.role !== "super_admin") {
    throw new Error("Unauthorized");
  }

  return true;
}

export async function updateOrganizationTierAction(organizationId: string, newPlan: PlanType) {
  await verifySuperAdmin();

  // Validate plan type
  if (!["free", "startup", "custom"].includes(newPlan)) {
    throw new Error("Invalid plan type");
  }

  const limits = PLAN_LIMITS[newPlan];

  // Get current organization to preserve other billing fields
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { billing: true },
  });

  if (!org) {
    throw new Error("Organization not found");
  }

  const currentBilling = org.billing as any;

  // Update organization billing with new plan and limits
  await prisma.organization.update({
    where: { id: organizationId },
    data: {
      billing: {
        ...currentBilling,
        plan: newPlan,
        limits,
      },
    },
  });

  revalidatePath("/admin");
  return { success: true, plan: newPlan };
}
