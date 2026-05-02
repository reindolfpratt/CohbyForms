import { KeyIcon } from "lucide-react";
import Link from "next/link";
import { OrganizationSettingsNavbar } from "@/app/(app)/environments/[environmentId]/settings/(organization)/components/OrganizationSettingsNavbar";
import { SettingsCard } from "@/app/(app)/environments/[environmentId]/settings/components/SettingsCard";
import { IS_FORMBRICKS_CLOUD } from "@/lib/constants";
import { findMatchingLocale } from "@/lib/utils/locale";
import { getTranslate } from "@/lingodotdev/server";
import { getEnvironmentAuth } from "@/modules/environments/lib/utils";
import { getProjectsByOrganizationId } from "@/modules/organization/settings/api-keys/lib/projects";
import { Button } from "@/modules/ui/components/button";
import { PageContentWrapper } from "@/modules/ui/components/page-content-wrapper";
import { PageHeader } from "@/modules/ui/components/page-header";
import { ApiKeyList } from "./components/api-key-list";

export const APIKeysPage = async (props) => {
  const params = await props.params;
  const t = await getTranslate();
  const locale = await findMatchingLocale();

  const { currentUserMembership, organization } = await getEnvironmentAuth(params.environmentId);

  const projects = await getProjectsByOrganizationId(organization.id);

  const canAccessApiKeys = currentUserMembership.role === "owner" || currentUserMembership.role === "manager";

  if (!canAccessApiKeys) throw new Error(t("common.not_authorized"));

  const isPaidPlan = (organization.billing as any)?.plan !== "free";

  return (
    <PageContentWrapper>
      <PageHeader pageTitle={t("environments.settings.general.organization_settings")}>
        <OrganizationSettingsNavbar
          environmentId={params.environmentId}
          isFormbricksCloud={IS_FORMBRICKS_CLOUD}
          membershipRole={currentUserMembership?.role}
          activeId="api-keys"
        />
      </PageHeader>
      {isPaidPlan ? (
        <SettingsCard
          title={t("common.api_keys")}
          description={t("environments.settings.api_keys.api_keys_description")}>
          <ApiKeyList
            organizationId={organization.id}
            locale={locale}
            isReadOnly={!canAccessApiKeys}
            projects={projects}
          />
        </SettingsCard>
      ) : (
        <div className="flex h-[50vh] flex-col items-center justify-center space-y-6 rounded-xl border border-slate-300 bg-white p-12 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
            <KeyIcon className="h-8 w-8 text-slate-400" />
          </div>
          <div className="max-w-md space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">Unlock API Access</h2>
            <p className="text-slate-500">
              Integrate CohbyForm with your own tools and automate your workflow with our API. Upgrade to our
              Startup plan to unlock API keys.
            </p>
          </div>
          <Button size="lg" className="px-8" asChild>
            <Link href={`/environments/${params.environmentId}/settings/billing`}>Upgrade to Startup</Link>
          </Button>
        </div>
      )}
    </PageContentWrapper>
  );
};
