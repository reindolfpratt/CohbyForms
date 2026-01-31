import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/modules/integrations/salesforce/service";
import { WEBAPP_URL } from "@/lib/constants";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const environmentId = url.searchParams.get("state"); // We pass environmentId as state

  if (!code || !environmentId) {
    return NextResponse.redirect(`${WEBAPP_URL}/environments/${environmentId}/integrations/salesforce?error=invalid_request`);
  }

  try {
    await authorize(environmentId, code);
    return NextResponse.redirect(`${WEBAPP_URL}/environments/${environmentId}/integrations/salesforce?success=true`);
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(`${WEBAPP_URL}/environments/${environmentId}/integrations/salesforce?error=authorization_failed`);
  }
}
