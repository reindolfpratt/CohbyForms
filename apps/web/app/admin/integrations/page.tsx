import { prisma } from "@formbricks/database";
import { Badge } from "@/modules/ui/components/badge";
// Client component wrapper for the switch to handle interactivity
import { WrapperSwitch } from "./components/wrapper-switch";

export const dynamic = "force-dynamic";

export default async function AdminIntegrationsPage() {
  // Get all defined settings
  const settings = await prisma.globalIntegrationSettings.findMany();

  // Map to a dictionary for easy lookup
  const settingsMap = settings.reduce(
    (acc, curr) => {
      acc[curr.type] = curr.isEnabled;
      return acc;
    },
    {} as Record<string, boolean>
  );

  // List of all integration types we want to manage
  // These keys must match the identifiers used in the user-facing page logic
  const integrationTypes = [
    "googleSheets",
    "notion",
    "airtable",
    "slack",
    "salesforce",
    "zapier",
    "n8n",
    "make",
    "activepieces",
    "webhooks",
    "js", // Javascript SDK
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Integration Control</h2>
        <p className="text-slate-500">
          Manage which integrations are visible to users. You (Super Admin) will always see all integrations
          regardless of this setting.
        </p>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <div className="p-4">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Integration</th>
                <th className="px-4 py-3 font-medium">Global Status</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {integrationTypes.map((type) => {
                const isEnabled = settingsMap[type] ?? false;

                return (
                  <tr key={type} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium capitalize text-slate-900">
                      {type.replace(/([A-Z])/g, " $1").trim()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={isEnabled ? "success" : "gray"}>
                        {isEnabled ? "Visible to All" : "Hidden (Admin Only)"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <WrapperSwitch type={type} initialValue={isEnabled} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
