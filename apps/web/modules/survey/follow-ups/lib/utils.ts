import { Organization } from "@prisma/client";
import { IS_FORMBRICKS_CLOUD, PROJECT_FEATURE_KEYS } from "@/lib/constants";

export const getSurveyFollowUpsPermission = async (
  _billingPlan: Organization["billing"]["plan"]
): Promise<boolean> => {
  return true;
};
