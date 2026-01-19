import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, token } = await req.json();

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  await transporter.sendMail({
    from: `"Electricity Payment" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Electricity Token",
    html: `<h2>Your Token</h2><p><strong>${token}</strong></p>`,
  });

  return NextResponse.json({ success: true });
}