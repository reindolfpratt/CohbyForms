import { Organization } from "@prisma/client";

export const getSurveyFollowUpsPermission = async (
  _billingPlan: Organization["billing"]["plan"]
): Promise<boolean> => {
  return true;
};
