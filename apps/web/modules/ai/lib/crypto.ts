import { TOrganizationAIConfig } from "@formbricks/types/organizations";
import { ENCRYPTION_KEY } from "@/lib/constants";
import { symmetricDecrypt, symmetricEncrypt } from "@/lib/crypto";

/**
 * Encrypts the API keys within an AI configuration object.
 * @param config The plain-text AI configuration
 * @returns The AI configuration with encrypted API keys
 */
export const encryptAIConfig = (config: TOrganizationAIConfig): TOrganizationAIConfig => {
  if (!ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY is not set");
  }

  const encryptedProviders = (config.providers ?? []).map((provider) => ({
    ...provider,
    apiKey: symmetricEncrypt(provider.apiKey, ENCRYPTION_KEY),
  }));

  return {
    ...config,
    providers: encryptedProviders,
  };
};

/**
 * Decrypts the API keys within an AI configuration object.
 * @param config The encrypted AI configuration
 * @returns The AI configuration with plain-text API keys
 */
export const decryptAIConfig = (config: TOrganizationAIConfig): TOrganizationAIConfig => {
  if (!ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY is not set");
  }

  const decryptedProviders = (config.providers ?? []).map((provider) => {
    try {
      return {
        ...provider,
        apiKey: symmetricDecrypt(provider.apiKey, ENCRYPTION_KEY),
      };
    } catch (error) {
      // If decryption fails, it might already be plain text or using an old key
      // We return it as-is but log a warning if needed
      return provider;
    }
  });

  return {
    ...config,
    providers: decryptedProviders,
  };
};
