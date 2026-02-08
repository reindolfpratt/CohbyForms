import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@formbricks/database";
import { authOptions } from "@/modules/auth/lib/authOptions";
import { Button } from "@/modules/ui/components/button";
import { ToasterClient } from "@/modules/ui/components/toaster-client";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return redirect("/auth/login");
  }

  // Super Admin Check
  // 1. Hardcoded email for immediate access
  const isSuperAdminEmail = session.user.email === "reindolfpratt@gmail.com";

  // 2. Database role check
  let isSuperAdminRole = false;
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    // @ts-ignore - Prisma client types might not be fully picked up by IDE yet despite generation
    isSuperAdminRole = user?.role === "super_admin";
  } catch (e) {
    console.error("Failed to check user role", e);
  }

  if (!isSuperAdminEmail && !isSuperAdminRole) {
    return redirect("/");
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <nav className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-slate-800">CohbyForms Admin</h1>
          <div className="flex gap-2">
            <Link
              href="/admin"
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
              Overview
            </Link>
            <Link
              href="/admin/integrations"
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
              Integrations
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">{session.user.email}</span>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Exit Admin</Link>
          </Button>
        </div>
      </nav>
      <main className="flex-1 overflow-auto p-8">
        <ToasterClient />
        {children}
      </main>
    </div>
  );
}
