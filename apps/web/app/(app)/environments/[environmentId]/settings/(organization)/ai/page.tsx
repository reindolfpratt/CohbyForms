import { SparklesIcon } from "lucide-react";
import Link from "next/link";
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

  const isAIAllowed = (organization.billing as any)?.plan !== "free";

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
        <div className="flex h-[50vh] flex-col items-center justify-center space-y-6 rounded-xl border border-slate-300 bg-white p-12 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
            <SparklesIcon className="h-8 w-8 text-slate-400" />
          </div>
          <div className="max-w-md space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">Unlock AI Capabilities</h2>
            <p className="text-slate-500">
              Generate surveys from prompts and analyze responses automatically with CohbyForm AI. Upgrade to
              our paid plans to unlock these features.
            </p>
          </div>
          <Button size="lg" className="px-8" asChild>
            <Link href={`/environments/${params.environmentId}/settings/billing`}>Upgrade Now</Link>
          </Button>
        </div>
      )}
    </PageContentWrapper>
  );
};

export default Page;
