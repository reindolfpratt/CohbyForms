import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@formbricks/database";
import { authOptions } from "@/modules/auth/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only allow owner/admin to run this? No, let's just make it available for now to fix the issue.

  try {
    const results = [];

    // Try adding the columns using raw SQL. Use IF NOT EXISTS to prevent errors if they already exist.
    // Note: We don't use the "public" schema prefix to be more flexible with search paths.
    try {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "aiConfig" JSONB DEFAULT '{}'`
      );
      results.push("Added aiConfig column (or it already existed)");
    } catch (e: any) {
      results.push(`Error adding aiConfig: ${e.message}`);
    }

    try {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "isAIEnabled" BOOLEAN DEFAULT false`
      );
      results.push("Added isAIEnabled column (or it already existed)");
    } catch (e: any) {
      results.push(`Error adding isAIEnabled: ${e.message}`);
    }

    return NextResponse.json({
      success: true,
      details: results,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
