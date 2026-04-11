import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    if (
      payload.type === "email.received" ||
      payload.type === "email.delivered"
    ) {
      const emailData = payload.data;

      const maintainersEnv = process.env.MAINTAINERS_EMAILS || "";
      const maintainers = maintainersEnv
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);

      if (maintainers.length === 0) {
        console.error(
          "No maintainers configured to receive the webhook forwarded email. Set MAINTAINERS_EMAILS in .env",
        );
        return NextResponse.json(
          { error: "Maintainers not configured" },
          { status: 500 },
        );
      }

      const { error } = await resend.emails.send({
        from: "DragonBallDle Form <help@dragonballdle.site>",
        to: maintainers,
        replyTo: emailData.from,
        subject: `[FORWARD FWD] ${emailData.subject || "Incoming Feedback Message"}`,
        text: `Forwarded from DragonBallDle Form.\n\nFrom: ${emailData.from}\nTo: ${emailData.to?.join(
          ",",
        )}\nSubject: ${emailData.subject}\n\nMessage:\n${
          emailData.text || "No plain text content available."
        }`,
        html: emailData.html
          ? `<div style="font-family: sans-serif;">
              <p><strong>Incoming Feedback Message</strong></p>
              <p><b>From:</b> ${emailData.from}</p>
              <p><b>Subject:</b> ${emailData.subject}</p>
              <hr />
              <div style="margin-top: 20px;">${emailData.html}</div>
             </div>`
          : undefined,
      });

      if (error) {
        console.error("Failed to forward inbound email via Resend:", error);
        return NextResponse.json(
          { error: "Failed to forward email" },
          { status: 500 },
        );
      }

      console.log(
        `Successfully forwarded inbound email to maintainers: ${maintainers.join(", ")}`,
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Critical Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal Server Error processing Webhook" },
      { status: 500 },
    );
  }
}
