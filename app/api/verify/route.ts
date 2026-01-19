import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { meterNo, serviceID, type } = await req.json();

  const res = await fetch(`${process.env.VTPASS_BASE_URL}/merchant-verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.VTPASS_API_KEY!,
      "secret-key": process.env.VTPASS_SECRET_KEY!,
    },
    body: JSON.stringify({
      billersCode: meterNo,
      serviceID,
      type,
    }),
  });

  const data = await res.json();

  if (data.code !== "000") {
    return NextResponse.json(
      { message: data.response_description },
      { status: 400 }
    );
  }

  return NextResponse.json({ data: data.content });
}