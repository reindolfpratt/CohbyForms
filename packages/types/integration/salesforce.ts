import { z } from "zod";
import { ZIntegrationBase, ZIntegrationBaseSurveyData } from "./shared-types";

export const ZSalesforceCredential = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  instance_url: z.string(),
  user_id: z.string(),
  org_id: z.string(),
});

export type TSalesforceCredential = z.infer<typeof ZSalesforceCredential>;

export const ZIntegrationSalesforceConfigData = z
  .object({
    objectName: z.string(),
    fieldMapping: z.array(
      z.object({
        formField: z.string(),
        salesforceField: z.string(),
      })
    ),
  })
  .merge(ZIntegrationBaseSurveyData);

export type TIntegrationSalesforceConfigData = z.infer<typeof ZIntegrationSalesforceConfigData>;

export const ZIntegrationSalesforceConfig = z.object({
  key: ZSalesforceCredential,
  data: z.array(ZIntegrationSalesforceConfigData),
});

export type TIntegrationSalesforceConfig = z.infer<typeof ZIntegrationSalesforceConfig>;

export const ZIntegrationSalesforce = ZIntegrationBase.extend({
  type: z.literal("salesforce"),
  config: ZIntegrationSalesforceConfig,
});

export type TIntegrationSalesforce = z.infer<typeof ZIntegrationSalesforce>;

export const ZIntegrationSalesforceInput = z.object({
  type: z.literal("salesforce"),
  config: ZIntegrationSalesforceConfig,
});

export type TIntegrationSalesforceInput = z.infer<typeof ZIntegrationSalesforceInput>;
