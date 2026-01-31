import { getMonnifyToken } from "@/lib/auth";
import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const token = await getMonnifyToken();
  const reference = `KBP-${Date.now()}`;

  await adminDb
    .collection("transactions")
    .doc(reference)
    .set({
      ...body,
      paymentReference: reference,
      status: "pending",
      attempts: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  if (
    !body.phone ||
    !/^(?:\+234|234|0)(7[0-9]|8[0-9]|9[0-1])[0-9]{8}$/.test(body.phone)
  ) {
    return NextResponse.json(
      { message: "Invalid phone number" },
      { status: 400 },
    );
  }

  const res = await fetch(
    `${process.env.MONNIFY_BASE_URL}/v1/merchant/transactions/init-transaction`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: body.amount,
        customerName: body.customerName,
        customerEmail: body.email,
        paymentReference: reference,
        paymentDescription: "Electricity payment",
        currencyCode: "NGN",
        contractCode: process.env.MONNIFY_CONTRACT_CODE!,
        redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL!}/pay/status?paymentReference=${reference}`,
        metaData: {
          meterNo: body.meterNo,
          disco: body.serviceID,
        },
      }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { message: data.message },
      { status: data.status },
    );
  }

  return NextResponse.json({
    reference,
    paymentUrl: data.responseBody.checkoutUrl,
  });
}
