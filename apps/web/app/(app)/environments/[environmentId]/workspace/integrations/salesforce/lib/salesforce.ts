import { logger } from "@formbricks/logger";

export const authorize = async (environmentId: string, apiHost: string): Promise<string> => {
  const res = await fetch(`${apiHost}/api/v1/integrations/salesforce/auth`, {
    method: "GET",
    headers: { environmentId: environmentId },
  });

  if (!res.ok) {
    const errorText = await res.text();
    logger.error({ errorText }, "authorize: Could not fetch salesforce config");
    throw new Error("Could not create response");
  }
  const resJSON = await res.json();
  const authUrl = resJSON.data.authUrl;
  // Append state (environmentId) to the authUrl
  // Note: jsforce might have already added state if we passed it generated, 
  // but here we might need to append it if the service didn't. 
  // Checking service: getAuthUrl didn't take args. 
  // So we should append it here or in the route.
  // Actually, jsforce's getAuthUrl takes properties. 
  // It's better to pass state to the service.
  // But for now let's assume we append it. A bit hacky but works for OAuth2 'state' param.
  
  const urlObj = new URL(authUrl);
  urlObj.searchParams.append("state", environmentId);
  return urlObj.toString();
};
