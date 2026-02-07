import "server-only";
import { Prisma } from "@prisma/client";
import jsforce from "jsforce";
import { DatabaseError, UnknownError } from "@formbricks/types/errors";
import { SALESFORCE_CLIENT_ID, SALESFORCE_CLIENT_SECRET, WEBAPP_URL } from "@/lib/constants";
import { createOrUpdateIntegration } from "@/lib/integration/service";

export const SALESFORCE_REDIRECT_URL = `${WEBAPP_URL}/api/v1/integrations/salesforce/callback`;

export const getAuthUrl = (environmentId: string) => {
  const oauth2 = new jsforce.OAuth2({
    clientId: SALESFORCE_CLIENT_ID,
    clientSecret: SALESFORCE_CLIENT_SECRET,
    redirectUri: SALESFORCE_REDIRECT_URL,
  });

  return oauth2.getAuthorizationUrl({
    scope: "api refresh_token offline_access",
    state: environmentId,
  });
};

export const authorize = async (environmentId: string, code: string) => {
  const oauth2 = new jsforce.OAuth2({
    clientId: SALESFORCE_CLIENT_ID,
    clientSecret: SALESFORCE_CLIENT_SECRET,
    redirectUri: SALESFORCE_REDIRECT_URL,
  });

  const connection = new jsforce.Connection({ oauth2 });

  try {
    const userInfo = await connection.authorize(code);

    if (
      !connection.accessToken ||
      !connection.refreshToken ||
      !connection.instanceUrl ||
      !userInfo.id ||
      !userInfo.organizationId
    ) {
      throw new Error("Incomplete Salesforce connection data");
    }

    // Save the integration with refresh token
    await createOrUpdateIntegration(environmentId, {
      type: "salesforce", // Ensure this matches schema enum
      config: {
        key: {
          access_token: connection.accessToken,
          refresh_token: connection.refreshToken,
          instance_url: connection.instanceUrl,
          user_id: userInfo.id,
          org_id: userInfo.organizationId,
        },
        data: [], // Mappings will go here
      },
    });

    return connection;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }
    throw new UnknownError(`Salesforce Authorization Error: ${error.message}`);
  }
};

export const getSalesforceObjects = async (integrationConfig: any) => {
  const connection = await getFreshConnection(integrationConfig);
  try {
    const meta = await connection.describeGlobal();
    return meta.sobjects
      .filter((obj) => obj.createable && obj.updateable && !obj.deprecatedAndHidden)
      .map((obj) => ({
        name: obj.name,
        label: obj.label,
      }));
  } catch (error) {
    throw new UnknownError(`Error fetching Salesforce objects: ${error.message}`);
  }
};

const getFreshConnection = async (integrationConfig: any) => {
  const oauth2 = new jsforce.OAuth2({
    clientId: SALESFORCE_CLIENT_ID,
    clientSecret: SALESFORCE_CLIENT_SECRET,
    redirectUri: SALESFORCE_REDIRECT_URL,
  });

  const connection = new jsforce.Connection({
    oauth2,
    instanceUrl: integrationConfig.key.instance_url,
    accessToken: integrationConfig.key.access_token,
    refreshToken: integrationConfig.key.refresh_token,
  });

  // jsforce handles auto-refresh if refreshToken is provided
  return connection;
};
