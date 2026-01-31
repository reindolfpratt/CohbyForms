import { redirect } from "next/navigation";
import { SalesforceWrapper } from "./components/SalesforceWrapper";
import { getSurveys } from "@/app/(app)/environments/[environmentId]/workspace/integrations/lib/surveys";
import {
  SALESFORCE_CLIENT_ID,
  SALESFORCE_CLIENT_SECRET,
  WEBAPP_URL,
} from "@/lib/constants";
import { getIntegrations } from "@/lib/integration/service";
import { getEnvironmentAuth } from "@/modules/environments/lib/utils";
import { GoBackButton } from "@/modules/ui/components/go-back-button";
import { PageContentWrapper } from "@/modules/ui/components/page-content-wrapper";
import { PageHeader } from "@/modules/ui/components/page-header";

const Page = async (props) => {
  const params = await props.params;
  const isEnabled = !!(SALESFORCE_CLIENT_ID && SALESFORCE_CLIENT_SECRET);

  const { isReadOnly, environment } = await getEnvironmentAuth(params.environmentId);

  const [surveys, integrations] = await Promise.all([
    getSurveys(params.environmentId),
    getIntegrations(params.environmentId),
  ]);

  const salesforceIntegration = integrations?.find(
    (integration) => integration.type === "salesforce"
  );

  if (isReadOnly) {
    return redirect("./");
  }

  return (
    <PageContentWrapper>
      <GoBackButton url={`${WEBAPP_URL}/environments/${params.environmentId}/workspace/integrations`} />
      <PageHeader pageTitle="Salesforce Integration" />
      <div className="h-[75vh] w-full">
        <SalesforceWrapper
          isEnabled={isEnabled}
          environment={environment}
          surveys={surveys}
          isSalesforceConnected={!!salesforceIntegration}
          webAppUrl={WEBAPP_URL}
        />
      </div>
    </PageContentWrapper>
  );
};

export default Page;
