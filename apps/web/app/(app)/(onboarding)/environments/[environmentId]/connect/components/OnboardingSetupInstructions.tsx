"use client";

import Link from "next/link";
import "prismjs/themes/prism.css";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { TProjectConfigChannel } from "@formbricks/types/project";
import { Button } from "@/modules/ui/components/button";
import { CodeBlock } from "@/modules/ui/components/code-block";

interface OnboardingSetupInstructionsProps {
  environmentId: string;
  publicDomain: string;
  channel: TProjectConfigChannel;
  appSetupCompleted: boolean;
}

export const OnboardingSetupInstructions = ({
  environmentId,
  publicDomain,
  channel,
  appSetupCompleted,
}: OnboardingSetupInstructionsProps) => {
  const { t } = useTranslation();
  const htmlSnippetForAppSurveys = `  <!-- START CohbyForm Surveys -->
  <script type="text/javascript">
  !function(){
      var appUrl = "${publicDomain}";
      var environmentId = "${environmentId}";
      var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src=appUrl+"/js/cohbyforms.umd.cjs",t.onload=function(){window.cohbyforms?window.cohbyforms.setup({environmentId:environmentId,appUrl:appUrl}):console.error("CohbyForm library failed to load properly. The SDK object is not available.");};var e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e)}();
  </script>
  <!-- END CohbyForm Surveys -->
  `;

  const htmlSnippetForWebsiteSurveys = `<!-- START CohbyForm Surveys -->
  <script type="text/javascript">
  !function(){
    var appUrl = "${publicDomain}";
    var environmentId = "${environmentId}";
    var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src=appUrl+"/js/cohbyforms.umd.cjs",t.onload=function(){window.cohbyforms?window.cohbyforms.setup({environmentId:environmentId,appUrl:appUrl}):console.error("CohbyForm library failed to load properly. The SDK object is not available.");};var e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e)}();
  </script>
  <!-- END CohbyForm Surveys -->
  `;

  return (
    <div className="prose prose-slate">
      <p className="-mb-1 mt-6 text-sm text-slate-700">
        {t("environments.connect.insert_this_code_into_the_head_tag_of_your_website")}
      </p>
      <div>
        <CodeBlock customEditorClass="!bg-white border border-slate-200" language="js">
          {channel === "app" ? htmlSnippetForAppSurveys : htmlSnippetForWebsiteSurveys}
        </CodeBlock>
      </div>

      <div className="mt-4 flex justify-between space-x-2">
        <Button
          id="onboarding-inapp-connect-copy-code"
          variant={appSetupCompleted ? "secondary" : "default"}
          onClick={() => {
            navigator.clipboard.writeText(
              channel === "app" ? htmlSnippetForAppSurveys : htmlSnippetForWebsiteSurveys
            );
            toast.success(t("common.copied_to_clipboard"));
          }}>
          {t("common.copy_code")}
        </Button>

        <Button id="onboarding-inapp-connect-step-by-step-manual" variant="secondary" asChild>
          <Link
            href={`https://formbricks.com/docs/${channel}-surveys/framework-guides#html`}
            target="_blank"
            className="no-underline">
            {t("common.step_by_step_manual")}
          </Link>
        </Button>
      </div>
    </div>
  );
};
