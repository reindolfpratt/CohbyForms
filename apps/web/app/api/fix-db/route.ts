import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@formbricks/database";
import { authOptions } from "@/modules/auth/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: any[] = [];

  try {
    // Try adding the columns using raw SQL.
    // Use multiple approaches to ensure it works across different environments.

    const queries = [
      `ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "aiConfig" JSONB DEFAULT '{}'`,
      `ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "isAIEnabled" BOOLEAN DEFAULT false`,
    ];

    for (const query of queries) {
      try {
        await prisma.$executeRawUnsafe(query);
        results.push({ query, status: "Success (or already existed)" });
      } catch (e: any) {
        results.push({ query, status: "Error", message: e.message });
      }
    }

    return NextResponse.json({
      success: true,
      details: results,
      message: "Database fix attempted. If errors persist, please contact support.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, details: results }, { status: 500 });
  }
}
