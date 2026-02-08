"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { prisma } from "@formbricks/database";
import { authOptions } from "@/modules/auth/lib/authOptions";

// remove unused import
// import { TIntegrationType } from "@formbricks/types/integration";

export async function toggleIntegrationAction(type: string, isEnabled: boolean) {
  const session = await getServerSession(authOptions);

  // Security Check (duplicate of layout but good for safety)
  if (session?.user?.email !== "reindolfpratt@gmail.com") {
    // Fallback DB check if needed, but for now email is primary super admin
    const user = await prisma.user.findUnique({ where: { id: session?.user?.id } });
    // @ts-ignore
    if (user?.role !== "super_admin") {
      throw new Error("Unauthorized");
    }
  }

  await prisma.globalIntegrationSettings.upsert({
    where: { type },
    update: { isEnabled },
    create: { type, isEnabled },
  });

  revalidatePath("/admin/integrations");
  revalidatePath("/(app)/environments/[environmentId]/workspace/integrations"); // Revalidate user facing page
}
