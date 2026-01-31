"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { TIntegrationType } from "@formbricks/types/integration";
import { Button } from "@/modules/ui/components/button";
import { FormbricksLogo } from "@/modules/ui/components/formbricks-logo";
import { getIntegrationDetails } from "./lib/utils";

interface ConnectIntegrationProps {
  isEnabled: boolean;
  integrationType: TIntegrationType | "salesforce";
  handleAuthorization: () => void;
  integrationLogoSrc: string | StaticImageData | null;
}

export const ConnectIntegration = ({
  isEnabled,
  integrationType,
  handleAuthorization,
  integrationLogoSrc,
}: ConnectIntegrationProps) => {
  const { t } = useTranslation();
  const [isConnecting, setIsConnecting] = useState(false);
  const searchParams = useSearchParams();
  const integrationDetails = getIntegrationDetails(integrationType, t);
  const handleConnect = () => {
    try {
      setIsConnecting(true);
      handleAuthorization();
    } catch (error) {
      console.error(error);
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    const error = searchParams?.get("error");
    if (error) {
      toast.error(t("environments.integrations.connecting_integration_failed_please_try_again"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-[75vh] w-full items-center justify-center">
      <div className="flex w-1/2 flex-col items-center justify-center rounded-lg bg-white p-8 shadow">
        <div className="flex w-1/2 justify-center -space-x-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white p-6 shadow-md">
            <FormbricksLogo />
          </div>
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white p-4 shadow-md">
            {integrationLogoSrc ? (
              <Image className="w-1/2" src={integrationLogoSrc} alt="logo" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-8 w-8">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
        <p className="my-8">{integrationDetails?.text}</p>
        {!isEnabled && (
          <p className="mb-8 rounded border-slate-200 bg-slate-100 p-3 text-sm">
            {integrationDetails?.notConfiguredText}
            <br />
            {t("common.follow_these")}{" "}
            <Link href={integrationDetails?.docsLink ?? ""} className="underline">
              {t("common.docs")}
            </Link>{" "}
            {t("environments.integrations.to_configure_it")}.
          </p>
        )}
        <Button loading={isConnecting} onClick={handleConnect} disabled={!isEnabled}>
          {integrationDetails?.connectButtonLabel}
        </Button>
      </div>
    </div>
  );
};
