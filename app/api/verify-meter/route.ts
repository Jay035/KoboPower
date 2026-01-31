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
  console.log(data);

  if (data.code !== "000") {
    return NextResponse.json(
      { message: data.response_description },
      { status: 400 }
    );
  }

  return NextResponse.json({ data: data.content });
}

// import { getMonnifyToken } from "@/lib/auth";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const { meterNo, billerCode } = await req.json();

//   if (!billerCode || !meterNo) {
//     return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
//   }

//   const token = await getMonnifyToken();
//   console.log(token);

//   const res = await fetch(
//     "https://sandbox.monnify.com/api/v1/vas/bills-payment/validate",
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         billerCode,
//         customerId: meterNo,
//       }),
//     },
//   );

//   const data = await res.json();

//   console.log(data);
//   if (!res.ok || !data.responseBody?.customerName) {
//     return NextResponse.json(
//       { message: "Meter verification failed" },
//       { status: 400 },
//     );
//   }

//   return NextResponse.json({
//     customerName: data.responseBody.customerName,
//     address: data.responseBody.customerAddress,
//   });
// }
