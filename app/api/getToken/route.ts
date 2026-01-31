import { NextResponse } from "next/server";

export async function POST() {
  const credentials = `${process.env.MONNIFY_API_KEY}:${process.env.MONNIFY_SECRET_KEY}`;
  const encoded = Buffer.from(credentials).toString("base64");

  const res = await fetch("https://sandbox.monnify.com/api/v1/auth/login", {
    method: "POST",
    headers: {
      Authorization: `Basic ${encoded}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  console.log(data);

  if (!res.ok) {
    return NextResponse.json(
      { message: data.responseMessage },
      { status: 400 },
    );
  }

  return NextResponse.json({ token: data.responseBody.accessToken });
}
