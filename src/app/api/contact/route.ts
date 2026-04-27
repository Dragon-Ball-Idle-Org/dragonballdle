import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const formData = await req.json();

    const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

    if (!contactEmail) {
      return NextResponse.json({ success: false, error: "Contact email target is not configured." }, { status: 500 });
    }

    const { data, error } = await resend.emails.send({
      from: "DragonBallDle Form <help@dragonballdle.site>",
      to: [contactEmail],
      replyTo: formData.email,
      subject: `New Message from ${formData.name}`,
      text: `Sender Name: ${formData.name}\nSender Email: ${formData.email}\n\nMessage:\n${formData.message}`,
    });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("API Route Email Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
