import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@formbricks/database";
import { authOptions } from "@/modules/auth/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No session" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });

    // Get memberships
    const memberships = await prisma.membership.findMany({
      where: { userId },
      include: {
        organization: {
          include: {
            projects: {
              include: {
                environments: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      session: {
        user: session.user,
      },
      dbUser: user,
      membershipsCount: memberships.length,
      memberships: memberships.map((m) => ({
        role: m.role,
        accepted: m.accepted,
        orgName: m.organization.name,
        projects: m.organization.projects.map((p) => ({
          name: p.name,
          environments: p.environments.map((e) => ({
            id: e.id,
            type: e.type,
          })),
        })),
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
