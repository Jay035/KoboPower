import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const {
    request_id,
    serviceID,
    billersCode,
    variation_code,
    amount,
    phone,
  } = await req.json();

  const res = await fetch(`${process.env.VTPASS_BASE_URL}/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.VTPASS_API_KEY!,
      "secret-key": process.env.VTPASS_SECRET_KEY!,
    },
    body: JSON.stringify({
      request_id,
      serviceID,
      billersCode,
      variation_code,
      amount,
      phone,
    }),
  });

  const data = await res.json();
  console.log(data);

  if (data.code !== "000") {
    return NextResponse.json(
      { message: data.response_description },
      { status: 400 },
    );
  }

  // const token =
  //   data.content?.tokens?.[0]?.token || data.content?.purchased_code;

  // await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-token`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ email, token }),
  // });

  return NextResponse.json({ data });
}
