import { NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/salesforce/service";

export async function GET() {
  const authUrl = getAuthUrl();
  return NextResponse.json({ data: { authUrl } });
}
