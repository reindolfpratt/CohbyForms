import { Project } from "@prisma/client";
import { CalendarClockIcon, CheckCircle2Icon, HelpCircleIcon, PauseCircleIcon } from "lucide-react";
import { TSurveyClosedMessage } from "@formbricks/types/surveys/types";
import { getTranslate } from "@/lingodotdev/server";

export const SurveyInactive = async ({
  status,
  surveyClosedMessage,
  project,
}: {
  status: "paused" | "completed" | "link invalid" | "response submitted" | "link expired";
  surveyClosedMessage?: TSurveyClosedMessage | null;
  project?: Pick<Project, "linkSurveyBranding">;
}) => {
  const t = await getTranslate();
  const icons = {
    paused: <PauseCircleIcon className="h-20 w-20" />,
    completed: <CheckCircle2Icon className="h-20 w-20" />,
    "link invalid": <HelpCircleIcon className="h-20 w-20" />,
    "response submitted": <CheckCircle2Icon className="h-20 w-20" />,
    "link expired": <CalendarClockIcon className="h-20 w-20" />,
  };
  const descriptions = {
    paused: t("s.paused"),
    completed: t("s.completed"),
    "link invalid": t("s.link_invalid"),
    "response submitted": t("s.response_submitted"),
    "link expired": t("c.link_expired_description"),
  };

  return (
    <div className="flex h-full flex-col items-center justify-between bg-gradient-to-br from-slate-200 to-slate-50 px-4 py-8 text-center">
      <div className="my-auto flex flex-col items-center space-y-3 text-slate-300">
        {icons[status]}
        <h1 className="text-4xl font-bold text-slate-800">
          {(status === "completed" || status === "link expired") && surveyClosedMessage
            ? surveyClosedMessage.heading
            : `${t("common.survey")} ${status}.`}
        </h1>
        <p className="text-lg leading-10 text-slate-500">
          {status === "completed" && surveyClosedMessage
            ? surveyClosedMessage.subheading
            : descriptions[status]}
        </p>
      </div>
    </div>
  );
};
