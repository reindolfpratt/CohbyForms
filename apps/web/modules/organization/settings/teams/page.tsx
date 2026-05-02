import { UsersIcon } from "lucide-react";
import Link from "next/link";
import { OrganizationSettingsNavbar } from "@/app/(app)/environments/[environmentId]/settings/(organization)/components/OrganizationSettingsNavbar";
import { IS_FORMBRICKS_CLOUD, USER_MANAGEMENT_MINIMUM_ROLE } from "@/lib/constants";
import { getUserManagementAccess } from "@/lib/membership/utils";
import { getTranslate } from "@/lingodotdev/server";
import { getAccessControlPermission } from "@/modules/ee/license-check/lib/utils";
import { getTeamsWhereUserIsAdmin } from "@/modules/ee/teams/lib/roles";
import { TeamsView } from "@/modules/ee/teams/team-list/components/teams-view";
import { getEnvironmentAuth } from "@/modules/environments/lib/utils";
import { MembersView } from "@/modules/organization/settings/teams/components/members-view";
import { Button } from "@/modules/ui/components/button";
import { PageContentWrapper } from "@/modules/ui/components/page-content-wrapper";
import { PageHeader } from "@/modules/ui/components/page-header";

export const TeamsPage = async (props: { params: Promise<{ environmentId: string }> }) => {
  const params = await props.params;
  const t = await getTranslate();

  const { session, currentUserMembership, organization } = await getEnvironmentAuth(params.environmentId);

  const isAccessControlAllowed = await getAccessControlPermission((organization.billing as any)?.plan);

  // Check if user has standard user management access (owner/manager)
  const hasStandardUserManagementAccess = getUserManagementAccess(
    currentUserMembership?.role,
    USER_MANAGEMENT_MINIMUM_ROLE
  );

  // Also check if user is a team admin (they get limited user management for invites)
  const userAdminTeamIds = await getTeamsWhereUserIsAdmin(session.user.id, organization.id);
  const isTeamAdminUser = userAdminTeamIds.length > 0;

  // Allow user management UI if they're owner/manager OR team admin (when access control is enabled)
  const hasUserManagementAccess =
    hasStandardUserManagementAccess || (isAccessControlAllowed && isTeamAdminUser);

  return (
    <PageContentWrapper>
      <PageHeader pageTitle={t("environments.settings.general.organization_settings")}>
        <OrganizationSettingsNavbar
          environmentId={params.environmentId}
          isFormbricksCloud={IS_FORMBRICKS_CLOUD}
          membershipRole={currentUserMembership?.role}
          activeId="teams"
        />
      </PageHeader>
      {isAccessControlAllowed ? (
        <>
          <MembersView
            membershipRole={currentUserMembership?.role}
            organization={organization}
            currentUserId={session.user.id}
            environmentId={params.environmentId}
            isAccessControlAllowed={isAccessControlAllowed}
            isUserManagementDisabledFromUi={!hasUserManagementAccess}
          />
          <TeamsView
            organizationId={organization.id}
            membershipRole={currentUserMembership?.role}
            currentUserId={session.user.id}
            isAccessControlAllowed={isAccessControlAllowed}
          />
        </>
      ) : (
        <div className="flex h-[50vh] flex-col items-center justify-center space-y-6 rounded-xl border border-slate-300 bg-white p-12 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
            <UsersIcon className="h-8 w-8 text-slate-400" />
          </div>
          <div className="max-w-md space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">Unlock Team Collaboration</h2>
            <p className="text-slate-500">
              Invite team members, assign roles, and organize projects into teams. Upgrade to our Startup plan
              to unlock collaboration features.
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
