import { Organization } from "@prisma/client";

export const getSurveyFollowUpsPermission = async (
  billingPlan: Organization["billing"]["plan"]
): Promise<boolean> => {
  return billingPlan !== "free";
};
