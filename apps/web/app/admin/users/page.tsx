import { prisma } from "@formbricks/database";
import { Badge } from "@/modules/ui/components/badge";
import { DeleteUserButton } from "./components/delete-user-button";

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

export default async function AdminUsersPage() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: {
            memberships: true,
          },
        },
      },
    });

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">User Management</h2>
          <p className="text-slate-500">Manage all registered users in the platform.</p>
        </div>

        <div className="rounded-md border bg-white shadow-sm">
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Organizations</th>
                  <th className="px-4 py-3 font-medium">Last Login</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{user.name || "No Name"}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        text={user.role}
                        type={
                          user.role === "super_admin" ? "error" : user.role === "admin" ? "warning" : "gray"
                        }
                        size="normal"
                      />
                    </td>
                    <td className="px-4 py-3">{user._count.memberships}</td>
                    <td className="px-4 py-3 text-slate-500">{formatLastLogin(user.lastLoginAt)}</td>
                    <td className="px-4 py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {user.role !== "super_admin" && (
                        <DeleteUserButton userId={user.id} userName={user.email} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && <div className="p-8 text-center text-slate-500">No users found.</div>}
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    console.error("ADMIN USERS PAGE ERROR:", error);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Admin Dashboard Error</h1>
        <p className="mt-4 text-slate-700">Something went wrong fetching users:</p>
        <pre className="mt-4 overflow-auto rounded bg-slate-100 p-4 text-sm text-red-800">
          {error.message || JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }
}
