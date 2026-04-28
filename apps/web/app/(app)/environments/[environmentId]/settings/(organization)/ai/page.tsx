import { OrganizationSettingsNavbar } from "@/app/(app)/environments/[environmentId]/settings/(organization)/components/OrganizationSettingsNavbar";
import { IS_FORMBRICKS_CLOUD } from "@/lib/constants";
import { getTranslate } from "@/lingodotdev/server";
import { decryptAIConfig } from "@/modules/ai/lib/crypto";
import { getEnvironmentAuth } from "@/modules/environments/lib/utils";
import { PageContentWrapper } from "@/modules/ui/components/page-content-wrapper";
import { PageHeader } from "@/modules/ui/components/page-header";
import { AISettingsForm } from "./components/AISettingsForm";

const Page = async (props: { params: Promise<{ environmentId: string }> }) => {
  const params = await props.params;
  const t = await getTranslate();

  const { currentUserMembership, organization } = await getEnvironmentAuth(params.environmentId);

  // Decrypt aiConfig if it exists
  const aiConfig = organization.aiConfig ? decryptAIConfig(organization.aiConfig as any) : { providers: [] };

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
      <AISettingsForm
        organizationId={organization.id}
        environmentId={params.environmentId}
        initialIsAIEnabled={organization.isAIEnabled || false}
        initialAIConfig={aiConfig}
      />
    </PageContentWrapper>
  );
};

export default Page;
