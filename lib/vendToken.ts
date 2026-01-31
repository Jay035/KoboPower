export function generateRequestId(): string {
  const now = new Date();

  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const ii = String(now.getMinutes()).padStart(2, "0");

  const timestamp = `${yyyy}${mm}${dd}${hh}${ii}`;

  const randomSuffix = Math.floor(100000 + Math.random() * 900000);

  return `${timestamp}${randomSuffix}`;
}

// export async function vendElectricity(tx) {
//   const request_id = `VEND-${Date.now()}`;

//   const res = await fetch(`${process.env.VTPASS_BASE_URL}/pay`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "api-key": process.env.VTPASS_API_KEY!,
//       "secret-key": process.env.VTPASS_SECRET_KEY!,
//     },
//     body: JSON.stringify({
//       request_id,
//       serviceID: tx.serviceID,
//       billersCode: tx.meterNo,
//       variation_code: tx.meterType,
//       amount: tx.amount,
//       phone: tx.phone,
//     }),
//   });

//   const data = await res.json();

//   if (data.code !== "000") {
//     return { success: false };
//   }

//   return {
//     success: true,
//     data: {
//       request_id,
//       token: data.content?.tokens,
//       units: data.content?.units,
//       receipt: data,
//     },
//   };
// }