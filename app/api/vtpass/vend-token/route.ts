export async function POST(req: Request) {
  const tx = await req.json();
  console.log("Vending token for tx:", tx);

  const res = await fetch(`${process.env.VTPASS_BASE_URL}/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.VTPASS_API_KEY!,
      "secret-key": process.env.VTPASS_SECRET_KEY!,
    },
    body: JSON.stringify({
      request_id: tx.reference,
      serviceID: tx.serviceID,
      billersCode: tx.meterNo,
      variation_code: tx.meterType,
      amount: tx.amount,
      phone: tx.phone,
    }),
  });

  const data = await res.json();

  if (data.code !== "000") throw new Error("Token vending failed");

  return data;
}