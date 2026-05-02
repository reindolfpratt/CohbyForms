import { OrganizationSettingsNavbar } from "@/app/(app)/environments/[environmentId]/settings/(organization)/components/OrganizationSettingsNavbar";
import { IS_FORMBRICKS_CLOUD } from "@/lib/constants";
import { getTranslate } from "@/lingodotdev/server";
import { decryptAIConfig } from "@/modules/ai/lib/crypto";
import { getEnvironmentAuth } from "@/modules/environments/lib/utils";
import { Button } from "@/modules/ui/components/button";
import { PageContentWrapper } from "@/modules/ui/components/page-content-wrapper";
import { PageHeader } from "@/modules/ui/components/page-header";
import { AISettingsForm } from "./components/AISettingsForm";

const Page = async (props: { params: Promise<{ environmentId: string }> }) => {
  const params = await props.params;
  const t = await getTranslate();

  const { currentUserMembership, organization } = await getEnvironmentAuth(params.environmentId);

  // Decrypt aiConfig if it exists
  const aiConfig = organization.aiConfig ? decryptAIConfig(organization.aiConfig as any) : { providers: [] };

  const isAIAllowed = organization.billing.plan === "custom";

  return (
    <PageContentWrapper>
      <PageHeader pageTitle={t("environments.settings.general.organization_settings")}>
        <OrganizationSettingsNavbar
          environmentId={params.environmentId}
          isFormbricksCloud={IS_FORMBRICKS_CLOUD}
          membershipRole={currentUserMembership?.role}
          activeId="ai"
        />
      </PageHeader>
      {isAIAllowed ? (
        <AISettingsForm
          organizationId={organization.id}
          initialIsAIEnabled={organization.isAIEnabled || false}
          initialAIConfig={aiConfig}
        />
      ) : (
        <div className="flex h-[50vh] flex-col items-center justify-center space-y-6 rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <span className="text-3xl">🤖</span>
          </div>
          <div className="max-w-md space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">Unlock AI Capabilities</h2>
            <p className="text-slate-500">
              Generate surveys from prompts and analyze responses automatically with CohbyForm AI. Upgrade to
              our Custom plan to unlock these features.
            </p>
          </div>
          <Button
            size="lg"
            className="px-8"
            onClick={() => {
              window.location.href = `/environments/${params.environmentId}/settings/billing`;
            }}>
            Upgrade to Custom
          </Button>
        </div>
      )}
    </PageContentWrapper>
  );
};

export default Page;
