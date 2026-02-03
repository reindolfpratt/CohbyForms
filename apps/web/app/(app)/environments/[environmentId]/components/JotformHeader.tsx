"use client";

import {
  ArrowUpRightIcon,
  ChevronRightIcon,
  Cog,
  LogOutIcon,
  MessageCircle,
  RocketIcon,
  UserCircleIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { TEnvironment } from "@formbricks/types/environment";
import { TOrganizationRole } from "@formbricks/types/memberships";
import { TOrganization } from "@formbricks/types/organizations";
import { TUser } from "@formbricks/types/user";
import { ProjectAndOrgSwitch } from "@/app/(app)/environments/[environmentId]/components/project-and-org-switch";
import { isNewerVersion } from "@/app/(app)/environments/[environmentId]/lib/utils";
import { cn } from "@/lib/cn";
import { getAccessFlags } from "@/lib/membership/utils";
import { useSignOut } from "@/modules/auth/hooks/use-sign-out";
import { getLatestStableFbReleaseAction } from "@/modules/projects/settings/(setup)/app-connection/actions";
import { ProfileAvatar } from "@/modules/ui/components/avatars";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/ui/components/dropdown-menu";
import packageJson from "../../../../../package.json";

interface JotformHeaderProps {
  environment: TEnvironment;
  user: TUser;
  organization: TOrganization;
  project: { id: string; name: string };
  environments: TEnvironment[];
  isFormbricksCloud: boolean;
  isDevelopment: boolean;
  membershipRole?: TOrganizationRole;
  publicDomain: string;
  isMultiOrgEnabled: boolean;
  organizationProjectsLimit: number;
  isLicenseActive: boolean;
  isAccessControlAllowed: boolean;
}

export const JotformHeader = ({
  environment,
  organization,
  user,
  project,
  environments,
  membershipRole,
  isFormbricksCloud,
  isDevelopment,
  publicDomain,
  isMultiOrgEnabled,
  organizationProjectsLimit,
  isLicenseActive,
  isAccessControlAllowed,
}: JotformHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const { signOut: signOutWithAudit } = useSignOut({ id: user.id, email: user.email });
  const [latestVersion, setLatestVersion] = useState("");

  const { isManager, isOwner, isMember, isBilling } = getAccessFlags(membershipRole);
  const isOwnerOrManager = isManager || isOwner;

  const mainNavigation = useMemo(
    () => [
      {
        name: t("common.surveys"),
        href: `/environments/${environment.id}/surveys`,
        icon: MessageCircle,
        isActive: pathname?.includes("/surveys"),
        isHidden: false,
      },
      {
        href: `/environments/${environment.id}/contacts`,
        name: t("common.contacts"),
        icon: UserIcon,
        isActive: pathname?.includes("/contacts") || pathname?.includes("/segments"),
      },
      {
        name: t("common.configuration"),
        href: `/environments/${environment.id}/workspace/general`,
        icon: Cog,
        isActive: pathname?.includes("/project"),
      },
    ],
    [t, environment.id, pathname]
  );

  const dropdownNavigation = [
    {
      label: t("common.account"),
      href: `/environments/${environment.id}/settings/profile`,
      icon: UserCircleIcon,
    },
    {
      label: t("common.documentation"),
      href: "https://formbricks.com/docs",
      target: "_blank",
      icon: ArrowUpRightIcon,
    },
    {
      label: t("common.share_feedback"),
      href: "https://github.com/formbricks/formbricks/issues",
      target: "_blank",
      icon: ArrowUpRightIcon,
    },
  ];

  useEffect(() => {
    async function loadReleases() {
      const res = await getLatestStableFbReleaseAction();
      if (res?.data) {
        const latestVersionTag = res.data;
        const currentVersionTag = `v${packageJson.version}`;

        if (isNewerVersion(currentVersionTag, latestVersionTag)) {
          setLatestVersion(latestVersionTag);
        }
      }
    }
    if (isOwnerOrManager) loadReleases();
  }, [isOwnerOrManager]);

  const mainNavigationLink = `/environments/${environment.id}/${isBilling ? "settings/billing/" : "surveys/"}`;

  return (
    <header className="flex h-[60px] w-full items-center justify-between bg-[#0a1551] px-4 text-white shadow-md">
      {/* Left Side: Logo + Navigation Links */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <Link href={mainNavigationLink} className="flex items-center">
          <span className="text-xl font-bold text-white">CohbyForm</span>
        </Link>

        {/* Navigation Links */}
        {!isBilling && (
          <nav className="hidden items-center gap-1 md:flex">
            {mainNavigation.map(
              (item) =>
                !item.isHidden && (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10",
                      item.isActive ? "bg-white/20 text-white" : "text-slate-200"
                    )}>
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
            )}
          </nav>
        )}
      </div>

      {/* Right Side: Project Switcher + User Profile */}
      <div className="flex items-center gap-4">
        {/* Project Switcher - Styled for Dark Header */}
        <div className="hidden md:block [&_.text-slate-500]:text-slate-300 [&_a:hover]:text-white [&_button:hover]:text-white">
          <ProjectAndOrgSwitch
            currentEnvironmentId={environment.id}
            environments={environments}
            currentOrganizationId={organization.id}
            currentProjectId={project.id}
            isMultiOrgEnabled={isMultiOrgEnabled}
            organizationProjectsLimit={organizationProjectsLimit}
            isFormbricksCloud={isFormbricksCloud}
            isLicenseActive={isLicenseActive}
            isOwnerOrManager={isOwnerOrManager}
            isMember={isMember}
            isAccessControlAllowed={isAccessControlAllowed}
          />
        </div>

        {/* New Version Alert */}
        {isOwnerOrManager && latestVersion && !isFormbricksCloud && !isDevelopment && (
          <Link
            href="https://github.com/formbricks/formbricks/releases"
            target="_blank"
            className="hidden items-center space-x-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20 lg:flex">
            <RocketIcon strokeWidth={1.5} className="h-3 w-3" />
            <span>{t("common.new_version_available", { version: latestVersion })}</span>
          </Link>
        )}

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="focus:outline-none">
            <div className="flex cursor-pointer items-center gap-2 rounded-full p-1 hover:bg-white/10">
              <ProfileAvatar userId={user.id} />
              <ChevronRightIcon className="h-4 w-4 text-slate-300" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="mb-1 flex items-center gap-2 border-b border-slate-100 p-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                <UserIcon className="h-4 w-4 text-slate-500" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-medium text-slate-900">{user.name}</span>
                <span className="truncate text-xs text-slate-500">{user.email}</span>
              </div>
            </div>
            {dropdownNavigation.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.target}
                rel={link.target === "_blank" ? "noopener noreferrer" : undefined}>
                <DropdownMenuItem>
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.label}
                </DropdownMenuItem>
              </Link>
            ))}
            <DropdownMenuItem
              onClick={async () => {
                const homeUrl = `${publicDomain}/`;
                await signOutWithAudit({
                  reason: "user_initiated",
                  redirectUrl: homeUrl,
                  organizationId: organization.id,
                  redirect: false,
                  callbackUrl: homeUrl,
                  clearEnvironmentId: true,
                });
                router.push(homeUrl);
              }}
              className="text-red-600 focus:bg-red-50 focus:text-red-600">
              <LogOutIcon className="mr-2 h-4 w-4" />
              {t("common.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
