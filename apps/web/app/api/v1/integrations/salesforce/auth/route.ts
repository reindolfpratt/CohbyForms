import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/salesforce/service";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const environmentId = url.searchParams.get("environmentId");

  if (!environmentId) {
    return NextResponse.json({ error: "Missing environmentId" }, { status: 400 });
  }

  const authUrl = getAuthUrl(environmentId);
  return NextResponse.json({ data: { authUrl } });
}
