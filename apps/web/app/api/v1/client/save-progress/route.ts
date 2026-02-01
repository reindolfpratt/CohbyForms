import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@formbricks/database";
import { logger } from "@formbricks/logger";
import { getPublicDomain } from "@/lib/getPublicUrl";
import { createResumeToken } from "@/lib/jwt";
import { getSurvey } from "@/lib/survey/service";
import { sendEmail } from "@/modules/email";

const ZSaveProgressInput = z.object({
  surveyId: z.string(),
  responseId: z.string(),
  email: z.string().email(),
});

export const POST = async (request: Request) => {
  try {
    const jsonInput = await request.json();
    const input = ZSaveProgressInput.safeParse(jsonInput);

    if (!input.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { surveyId, responseId, email } = input.data;

    // Validate existence
    const survey = await getSurvey(surveyId);
    if (!survey) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    const response = await prisma.response.findUnique({
      where: { id: responseId },
    });

    if (!response || response.surveyId !== surveyId) {
      return NextResponse.json({ error: "Response not found" }, { status: 404 });
    }

    // Generate Token
    const resumeToken = createResumeToken(responseId);

    // Build Link
    const publicDomain = getPublicDomain();
    const resumeLink = `${publicDomain}/s/${surveyId}?resume=${encodeURIComponent(resumeToken)}`;

    // Send Email
    // Using a simple HTML template for now.
    const htmlData = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { display: inline-block; padding: 12px 24px; background-color: #0a1551; color: white !important; text-decoration: none; border-radius: 6px; font-weight: bold; }
            .footer { margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Save & Continue</h2>
            <p>You have requested to save your progress for <strong>${survey.name}</strong>.</p>
            <p>Click the button below to resume your form exactly where you left off:</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${resumeLink}" class="button">Resume Form</a>
            </p>
            <p>Or copy this link:</p>
            <p><code>${resumeLink}</code></p>
            <div class="footer">
              <p>This link is valid for 30 days.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmail({
      to: email,
      subject: `Continue your form: ${survey.name}`,
      html: htmlData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error(error, "Error saving progress");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
