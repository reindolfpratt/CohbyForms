"use client";

import { useState } from "react";
import { TEnvironment } from "@formbricks/types/environment";
import { TSurvey } from "@formbricks/types/surveys/types";
import { authorize } from "./salesforce"; // Import from local lib
import { ConnectIntegration } from "@/modules/ui/components/connect-integration";
import { Button } from "@/modules/ui/components/button";

interface SalesforceWrapperProps {
  isEnabled: boolean;
  environment: TEnvironment;
  surveys: TSurvey[];
  isSalesforceConnected: boolean; // Simplified for now
  webAppUrl: string;
}

export const SalesforceWrapper = ({
  isEnabled,
  environment,
  isSalesforceConnected,
  webAppUrl,
}: SalesforceWrapperProps) => {
  const [isConnected, setIsConnected] = useState(isSalesforceConnected);

  const handleAuthorization = async () => {
    try {
      const url = await authorize(environment.id, webAppUrl);
      if (url) {
        window.location.replace(url);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to initialize Salesforce connection");
    }
  };

  return (
    <>
      {isConnected ? (
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Salesforce Connected!</h2>
          <p className="text-slate-500">Your account is successfully linked.</p>
          <Button variant="outline" onClick={() => alert("Mapping features coming soon!")}>
            Manage Mappings
          </Button>
        </div>
      ) : (
        <ConnectIntegration
          isEnabled={isEnabled}
          integrationType={"salesforce"} // Assuming this type is accepted or just string
          handleAuthorization={handleAuthorization}
          integrationLogoSrc={null} // No logo for now, or use a default
        />
      )}
    </>
  );
};
