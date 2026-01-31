import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { reference } = await req.json();

  const ref = adminDb.collection("transactions").doc(reference);
  const snap = await ref.get();

  if (!snap.exists) {
    return NextResponse.json(
      { message: "Transaction not found" },
      { status: 404 },
    );
  }

  const tx = snap.data();

  if (tx?.status === "success") {
    return NextResponse.json({ message: "Already vended" });
  }

  if (tx?.status !== "paid") {
    return NextResponse.json(
      { message: "Payment not confirmed" },
      { status: 400 },
    );
  }

  const vtpassRes = await fetch(`${process.env.VTPASS_BASE_URL}/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.VTPASS_API_KEY!,
      "secret-key": process.env.VTPASS_SECRET_KEY!,
    },
    body: JSON.stringify({
      request_id: reference,
      serviceID: tx.serviceID,
      billersCode: tx.meterNo,
      variation_code: tx.meterType,
      amount: tx.amount - 100,
      phone: tx.phone,
    }),
  });

  const data = await vtpassRes.json();

  if (data.code !== "000") {
    await ref.update({
      status: "vend_failed",
      vendError: data.response_description,
      attempts: (tx.attempts || 0) + 1,
    });

    return NextResponse.json({ message: "Vend failed" }, { status: 500 });
  }

  await ref.update({
    status: "success",
    token: data.purchased_code,
    units: data.units,
    vendResponse: data,
    updatedAt: new Date(),
  });

  return NextResponse.json({ ok: true });
}
