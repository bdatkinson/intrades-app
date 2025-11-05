import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) {
    return NextResponse.json(
      { error: "RESEND_API_KEY and RESEND_FROM must be set" },
      { status: 400 }
    );
  }

  const { to, subject = "Hello from intrades-app", html = "<p>This is a test email.</p>" } =
    await req.json();
  if (!to) return NextResponse.json({ error: "Missing 'to'" }, { status: 400 });

  const resend = new Resend(apiKey);
  try {
    const { data, error } = await resend.emails.send({ from, to, subject, html });
    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ id: data?.id }, { status: 200 });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
