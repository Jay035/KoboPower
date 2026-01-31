import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { request_id } = await req.json();

  const res = await fetch(`${process.env.VTPASS_BASE_URL}/requery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.VTPASS_API_KEY!,
      "secret-key": process.env.VTPASS_SECRET_KEY!,
    },
    body: JSON.stringify({
      request_id,
    }),
  });

  const data = await res.json();
  console.log(data);

  if (data.code !== "000") {
    return NextResponse.json(
      { message: data.response_description },
      { status: 400 }
    );
  }

  return NextResponse.json({ data: data.content });
}