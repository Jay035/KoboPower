import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("paymentReference");
  console.log("Fetching transaction for paymentReference:", ref);

    if (!ref) {
    return NextResponse.json(
      { message: "paymentReference required" },
      { status: 400 },
    );
  }

  const snap = await adminDb
    .collection("transactions")
    .doc(ref!)
    .get();


  if (!snap.exists) {
    return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
  }

  return NextResponse.json(snap.data());
}