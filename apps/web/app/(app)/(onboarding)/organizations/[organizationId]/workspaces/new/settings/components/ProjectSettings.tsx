"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  TProjectConfigChannel,
  TProjectConfigIndustry,
  TProjectMode,
  TProjectUpdateInput,
  ZProjectUpdateInput,
} from "@formbricks/types/project";
import { createProjectAction } from "@/app/(app)/environments/[environmentId]/actions";
import { FORMBRICKS_SURVEYS_FILTERS_KEY_LS } from "@/lib/localStorage";
import { getFormattedErrorMessage } from "@/lib/utils/helper";
import { TOrganizationTeam } from "@/modules/ee/teams/project-teams/types/team";
import { CreateTeamModal } from "@/modules/ee/teams/team-list/components/create-team-modal";
import { Button } from "@/modules/ui/components/button";
import {
  FormControl,
  FormDescription,
  FormError,
  FormField,
  FormItem,
  FormLabel,
  FormProvider,
} from "@/modules/ui/components/form";
import { Input } from "@/modules/ui/components/input";
import { MultiSelect } from "@/modules/ui/components/multi-select";

interface ProjectSettingsProps {
  organizationId: string;
  projectMode: TProjectMode;
  channel: TProjectConfigChannel;
  industry: TProjectConfigIndustry;
  defaultBrandColor: string;
  organizationTeams: TOrganizationTeam[];
  isAccessControlAllowed: boolean;
  userProjectsCount: number;
}

export const ProjectSettings = ({
  organizationId,
  projectMode,
  channel,
  industry,
  defaultBrandColor,
  organizationTeams,
  isAccessControlAllowed = false,
  userProjectsCount,
}: ProjectSettingsProps) => {
  const [createTeamModalOpen, setCreateTeamModalOpen] = useState(false);

  const router = useRouter();
  const { t } = useTranslation();
  const addProject = async (data: TProjectUpdateInput) => {
    try {
      const createProjectResponse = await createProjectAction({
        organizationId,
        data: {
          ...data,
          config: { channel, industry },
          teamIds: data.teamIds,
        },
      });

      if (createProjectResponse?.data) {
        // get production environment
        const productionEnvironment = createProjectResponse.data.environments.find(
          (environment) => environment.type === "production"
        );
        if (productionEnvironment) {
          if (globalThis.window !== undefined) {
            // Rmove filters when creating a new project
            localStorage.removeItem(FORMBRICKS_SURVEYS_FILTERS_KEY_LS);
          }
        }
        if (channel === "app" || channel === "website") {
          router.push(`/environments/${productionEnvironment?.id}/connect`);
        } else if (channel === "link") {
          router.push(`/environments/${productionEnvironment?.id}/surveys`);
        } else if (projectMode === "cx") {
          router.push(`/environments/${productionEnvironment?.id}/xm-templates`);
        }
      } else {
        const errorMessage = getFormattedErrorMessage(createProjectResponse);
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error(t("organizations.workspaces.new.settings.workspace_creation_failed"));
      console.error(error);
    }
  };

  const form = useForm<TProjectUpdateInput>({
    defaultValues: {
      name: "",
      styling: { allowStyleOverwrite: true, brandColor: { light: defaultBrandColor } },
      teamIds: [],
    },
    resolver: zodResolver(ZProjectUpdateInput),
  });
  const projectName = form.watch("name");
  const logoUrl = form.watch("logo.url");
  const brandColor = form.watch("styling.brandColor.light") ?? defaultBrandColor;
  const { isSubmitting } = form.formState;

  const organizationTeamsOptions = organizationTeams.map((team) => ({
    label: team.name,
    value: team.id,
  }));

  return (
    <div className="mt-6 flex w-full max-w-md flex-col space-y-4">
      <div className="flex w-full flex-col space-y-4">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(addProject)} className="w-full space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState: { error } }) => (
                <FormItem className="w-full space-y-4">
                  <div>
                    <FormLabel>{t("organizations.workspaces.new.settings.workspace_name")}</FormLabel>
                    <FormDescription>
                      {t("organizations.workspaces.new.settings.workspace_name_description")}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <div>
                      <Input
                        value={field.value}
                        onChange={(name) => field.onChange(name)}
                        placeholder="e.g. CohbyForm"
                        className="bg-white"
                        autoFocus={true}
                      />
                      {error?.message && <FormError className="text-left">{error.message}</FormError>}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            {isAccessControlAllowed && userProjectsCount > 0 && (
              <FormField
                control={form.control}
                name="teamIds"
                render={({ field, fieldState: { error } }) => (
                  <FormItem className="w-full space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <FormLabel>{t("common.teams")}</FormLabel>
                        <FormDescription>
                          {t("organizations.workspaces.new.settings.team_description")}
                        </FormDescription>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        type="button"
                        onClick={() => setCreateTeamModalOpen(true)}>
                        {t("organizations.workspaces.new.settings.create_new_team")}
                      </Button>
                    </div>
                    <FormControl>
                      <div>
                        <MultiSelect
                          value={field.value}
                          options={organizationTeamsOptions}
                          onChange={(teamIds) => field.onChange(teamIds)}
                        />
                        {error?.message && <FormError className="text-left">{error.message}</FormError>}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            <div className="flex w-full justify-end">
              <Button loading={isSubmitting} type="submit" id="form-next-button">
                {t("common.next")}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>

      <CreateTeamModal
        open={createTeamModalOpen}
        setOpen={setCreateTeamModalOpen}
        organizationId={organizationId}
        onCreate={(teamId) => {
          form.setValue("teamIds", [...(form.getValues("teamIds") || []), teamId]);
        }}
      />
    </div>
  );
};
