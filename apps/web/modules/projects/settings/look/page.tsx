import { SettingsCard } from "@/app/(app)/environments/[environmentId]/settings/components/SettingsCard";
import { cn } from "@/lib/cn";
import { IS_STORAGE_CONFIGURED, SURVEY_BG_COLORS, UNSPLASH_ACCESS_KEY } from "@/lib/constants";
import { getPublicDomain } from "@/lib/getPublicUrl";
import { getTranslate } from "@/lingodotdev/server";
import { getRemoveBrandingPermission } from "@/modules/ee/license-check/lib/utils";
import { BrandingSettingsCard } from "@/modules/ee/whitelabel/remove-branding/components/branding-settings-card";
import { getEnvironmentAuth } from "@/modules/environments/lib/utils";
import { ProjectConfigNavigation } from "@/modules/projects/settings/components/project-config-navigation";
import { EditLogo } from "@/modules/projects/settings/look/components/edit-logo";
import { getProjectByEnvironmentId } from "@/modules/projects/settings/look/lib/project";
import { Alert, AlertDescription } from "@/modules/ui/components/alert";
import { PageContentWrapper } from "@/modules/ui/components/page-content-wrapper";
import { PageHeader } from "@/modules/ui/components/page-header";
import { EditPlacementForm } from "./components/edit-placement-form";
import { ThemeStyling } from "./components/theme-styling";

export const ProjectLookSettingsPage = async (props: { params: Promise<{ environmentId: string }> }) => {
  const params = await props.params;
  const t = await getTranslate();

  const { isReadOnly, organization } = await getEnvironmentAuth(params.environmentId);

  const project = await getProjectByEnvironmentId(params.environmentId);

  if (!project) {
    throw new Error("Workspace not found");
  }

  const canRemoveBranding = await getRemoveBrandingPermission(organization.billing.plan);
  const publicDomain = getPublicDomain();
  const isFreePlan = organization.billing.plan === "free";

  return (
    <PageContentWrapper>
      <PageHeader pageTitle={t("common.workspace_configuration")}>
        <ProjectConfigNavigation environmentId={params.environmentId} activeId="look" />
      </PageHeader>
      {!IS_STORAGE_CONFIGURED && (
        <Alert variant="warning">
          <AlertDescription>{t("common.storage_not_configured")}</AlertDescription>
        </Alert>
      )}
      <SettingsCard
        title={t("environments.workspace.look.theme")}
        className={cn(!isReadOnly && "max-w-7xl")}
        description={t("environments.workspace.look.theme_settings_description")}>
        <ThemeStyling
          environmentId={params.environmentId}
          project={project}
          colors={SURVEY_BG_COLORS}
          isUnsplashConfigured={!!UNSPLASH_ACCESS_KEY}
          isReadOnly={isReadOnly}
          isStorageConfigured={IS_STORAGE_CONFIGURED}
          publicDomain={publicDomain}
        />
      </SettingsCard>
      <SettingsCard
        title={t("common.logo")}
        description={t("environments.workspace.look.logo_settings_description")}>
        {isFreePlan ? (
          <div className="flex flex-col items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-800">
              Logo upload is available on the <strong>Startup</strong> and <strong>Enterprise</strong> plans.
            </p>
            <a
              href={`/environments/${params.environmentId}/settings/billing`}
              className="inline-flex items-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700">
              Upgrade to unlock
            </a>
          </div>
        ) : (
          <EditLogo
            project={project}
            environmentId={params.environmentId}
            isReadOnly={isReadOnly}
            isStorageConfigured={IS_STORAGE_CONFIGURED}
          />
        )}
      </SettingsCard>
      <SettingsCard
        title={t("environments.workspace.look.app_survey_placement")}
        description={t("environments.workspace.look.app_survey_placement_settings_description")}>
        <EditPlacementForm project={project} environmentId={params.environmentId} isReadOnly={isReadOnly} />
      </SettingsCard>

      <BrandingSettingsCard
        canRemoveBranding={canRemoveBranding}
        project={project}
        environmentId={params.environmentId}
        isReadOnly={isReadOnly}
      />
    </PageContentWrapper>
  );
};
