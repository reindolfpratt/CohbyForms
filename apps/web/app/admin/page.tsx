import { prisma } from "@formbricks/database";
import { Badge } from "@/modules/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/ui/components/card";
import { TierDropdown } from "./components/tier-dropdown";

export const dynamic = "force-dynamic";

// Helper to format relative time
const formatLastLogin = (date: Date | null | undefined): string => {
  if (!date) return "Never";
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  if (days > 30) return new Date(date).toLocaleDateString();
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
};

export default async function AdminOverviewPage() {
  try {
    // Fetch all organizations with counts
    const organizations = await prisma.organization.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
        billing: true,
        _count: {
          select: {
            projects: true,
            memberships: true,
          },
        },
        memberships: {
          where: { role: "owner" },
          select: {
            user: {
              select: { email: true, name: true, lastLoginAt: true },
            },
          },
          take: 1,
        },
      },
    });

    // Fetch additional stats
    const [totalUsers, totalProjects] = await Promise.all([prisma.user.count(), prisma.project.count()]);

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Organization Overview</h2>
          <p className="text-slate-500">Manage all registered organizations and their tiers.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{organizations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-md border bg-white shadow-sm">
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Organization</th>
                  <th className="px-4 py-3 font-medium">Owner</th>
                  <th className="px-4 py-3 font-medium">Current Plan</th>
                  <th className="px-4 py-3 font-medium">Members</th>
                  <th className="px-4 py-3 font-medium">Projects</th>
                  <th className="px-4 py-3 font-medium">Last Login</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Change Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {organizations.map((org) => {
                  const owner = org.memberships[0]?.user;
                  // @ts-ignore
                  const planId = org.billing?.plan || "free";

                  return (
                    <tr key={org.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{org.name}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{owner?.name || "Unknown"}</div>
                        <div className="text-xs text-slate-500">{owner?.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          text={planId}
                          type={planId === "startup" ? "success" : planId === "custom" ? "warning" : "gray"}
                          size="normal"
                        />
                      </td>
                      <td className="px-4 py-3">{org._count.memberships}</td>
                      <td className="px-4 py-3">{org._count.projects}</td>
                      <td className="px-4 py-3 text-slate-500">{formatLastLogin(owner?.lastLoginAt)}</td>
                      <td className="px-4 py-3">{new Date(org.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <TierDropdown organizationId={org.id} currentPlan={planId} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {organizations.length === 0 && (
              <div className="p-8 text-center text-slate-500">No organizations found.</div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    console.error("ADMIN PAGE ERROR:", error);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Admin Dashboard Error</h1>
        <p className="mt-4 text-slate-700">Something went wrong fetching data:</p>
        <pre className="mt-4 overflow-auto rounded bg-slate-100 p-4 text-sm text-red-800">
          {error.message || JSON.stringify(error, null, 2)}
        </pre>
        <p className="mt-4 text-sm text-slate-500">Stack: {error.stack}</p>
      </div>
    );
  }
}
