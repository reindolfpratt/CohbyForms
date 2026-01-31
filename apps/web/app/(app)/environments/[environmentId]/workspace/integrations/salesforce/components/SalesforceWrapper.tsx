"use client";

import { useState } from "react";
import { TEnvironment } from "@formbricks/types/environment";
import { TSurvey } from "@formbricks/types/surveys/types";
import { Button } from "@/modules/ui/components/button";
// Import from local lib
import { ConnectIntegration } from "@/modules/ui/components/connect-integration";
import { authorize } from "../lib/salesforce";

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
        setIsConnected(true); // Update connection state after successful authorization
      }
    } catch (err) {
      console.error(err);
      setIsConnected(false); // Handle failure state
      alert("Failed to initialize Salesforce connection");
    }
  };

  return (
    <>
      {isConnected ? (
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-white p-6 shadow">
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
