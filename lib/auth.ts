let cachedToken: string | null = null;
let tokenExpiry = 0;

export async function getMonnifyToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const credentials = `${process.env.MONNIFY_API_KEY}:${process.env.MONNIFY_SECRET_KEY}`;
  const encoded = Buffer.from(credentials).toString("base64");

  const res = await fetch(
    "https://sandbox.monnify.com/api/v1/auth/login",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${encoded}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  const data = await res.json();
  console.log(data);

  if (!res.ok) {
    throw new Error(data.responseMessage || "Monnify auth failed");
  }

  cachedToken = data.responseBody.accessToken;
  tokenExpiry = Date.now() + 55 * 60 * 1000; // 55 minutes

  return cachedToken!;
}