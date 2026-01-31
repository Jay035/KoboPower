import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebaseAdmin";
import { generateRequestId } from "@/lib/vendToken";

export async function POST(req: Request) {
  const body = await req.json();

  const signature = req.headers.get("monnify-signature");
  const secret = process.env.MONNIFY_SECRET_KEY!;

  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(body))
    .digest("hex");

  if (hash !== signature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  const { paymentReference, paymentStatus, amountPaid } = body.eventData;
  console.log("Webhook body:", body);
  console.log(
    "Webhook received for paymentReference:",
    paymentReference,
    "with status:",
    paymentStatus,
  );

  const txRef = adminDb.collection("transactions").doc(paymentReference);
  const snap = await txRef.get();

  if (!snap.exists) return NextResponse.json({ ok: true });

  const tx = snap.data();
  console.log(tx);

  if (tx?.status === "success") {
    return NextResponse.json({ ok: true });
  }

  if (paymentStatus !== "PAID") {
    await txRef.update({
      status: "failed",
      updatedAt: new Date(),
    });
    return NextResponse.json({ ok: true });
  }

  // Mark paid but NOT vended yet
  await txRef.update({
    status: "paid",
    paidAmount: Number(amountPaid ?? tx?.amount ?? 0),
    updatedAt: new Date(),
  });

  // 5️⃣ Vend token
  try {
    const vtpassRes = await fetch(`${process.env.VTPASS_BASE_URL}/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.VTPASS_API_KEY!,
        "secret-key": process.env.VTPASS_SECRET_KEY!,
      },
      body: JSON.stringify({
        request_id: generateRequestId(),
        serviceID: tx?.serviceID,
        billersCode: tx?.meterNo,
        variation_code: tx?.meterType,
        amount: tx?.amount,
        phone: tx?.phone,
      }),
    });

    const vtpassData = await vtpassRes.json();

    if (vtpassData.code !== "000") {
      throw new Error(vtpassData.response_description);
    }
    console.log("Vtpass vend response:", vtpassData);

    // 6️⃣ Save token (FINAL STATE)
    await txRef.update({
      status: "success",
      token: vtpassData.token,
      vendResponse: vtpassData.content,
      updatedAt: new Date(),
    });
  } catch (err: unknown) {
    // 7️⃣ Retry-safe failure
    let errorMessage = "Unknown error";
    if (err instanceof Error) {
      errorMessage = err.message;
    } else if (typeof err === "string") {
      errorMessage = err;
    }
    await txRef.update({
      status: "vend_failed",
      vendError: errorMessage,
      attempts: (tx?.attempts ?? 0) + 1,
      updatedAt: new Date(),
    });
  }

  return NextResponse.json({ ok: true });
}
