"use client";

import React, { useState } from "react";
import { X, Loader2, CheckCircle } from "lucide-react";
import { Disco } from "@/types";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  disco: Disco;

}

function generateRequestId(): string {
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

function formatToken(token: string): string {
  return token.replace(/(.{4})/g, "$1-").replace(/-$/, "");
}

export default function PaymentModal({
  isOpen,
  onClose,
  disco,
}: PaymentModalProps) {
  const [step, setStep] = useState<"verify" | "pay" | "success">("verify");

  const [meterNo, setMeterNo] = useState("");
  const [meterType, setMeterType] = useState("prepaid");
  const [amount, setAmount] = useState<number | null>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [token, setToken] = useState("");
  const [response, setResponse] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Copy failed. Please copy manually.");
    }
  };

  if (!isOpen) return null;

  // const getServices = async () => {
  //   try {
  //     const res = await fetch(
  //       "https://sandbox.vtpass.com/api/service-categories",
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "api-key": process.env.VTPASS_API_KEY!,
  //           "public-key": process.env.VTPASS_PUBLIC_KEY!,
  //         },
  //       },
  //     );

  //     const data = await res.json();

  //     if (!res.ok) throw new Error(data.message);
  //     console.log(data);

  //     setCustomerName(data.data.Customer_Name);
  //     setStep("pay");
  //   } catch (err: any) {
  //     setError(err.message || "Verification failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleGetToken = async () => {
  //   try {
  //     const res = await fetch("/api/getToken", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     const data = await res.json();
  //     console.log(data);

  //     if (!res.ok) throw new Error(data.message);
  //     return data.token;
  //   } catch (err: unknown) {
  //     const errorMessage =
  //       err instanceof Error ? err.message : "Token retrieval failed";
  //     setError(errorMessage);
  //     return null;
  //   }
  // };

  // const handleGetBillers = async () => {
  //   try {
  //     const res = await fetch("/api/getBillers", {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     const data = await res.json();
  //     console.log(data);
  //     setLoading(false);

  //     if (!res.ok) throw new Error(data.message);
  //     return data.token;
  //   } catch (err: unknown) {
  //     const errorMessage =
  //       err instanceof Error ? err.message : "Error fetching biller categories";
  //     setError(errorMessage);
  //     return null;
  //   }
  // };

  /* ---------------- VERIFY ---------------- */
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // const billerCode = disco.billers[meterType as "prepaid" | "postpaid"];
    // console.log(billerCode);
    try {
      const res = await fetch("/api/vtpass/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({
        //   billerCode,
        //   meterNo,
        // }),
        body: JSON.stringify({
          meterNo,
          serviceID: disco.serviceID,
          type: meterType,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      if (data.data.WrongBillersCode === true) {
        setError(`${data.data.error}. Confirm your meter number is accurate.`);
        console.log(data.data);
        return;
      }
      console.log(data);

      setCustomerName(data.data.Customer_Name);
      setStep("pay");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Verification failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- PAY ---------------- */
  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const request_id = generateRequestId();

    console.log(phone, email);

    try {
      const res = await fetch("/api/vtpass/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_id,
          serviceID: disco.serviceID,
          billersCode: meterNo,
          variation_code: meterType,
          amount,
          phone,
        }),
      });

      const result = await res.json();
      console.log(result);
      if (!res.ok) {
        setError("Invalid Inputs. Please check your entries and try again.");
        // throw new Error(result.message);
        return;
      }

      const purchasedCode = result.data?.token;

      if (meterType.toLowerCase() === "prepaid" && !purchasedCode)
        throw new Error("Token not returned");
      console.log(request_id);
      const confirmed = handlePaymentConfirmation(request_id);
      console.log(confirmed);
      if (!confirmed)
        throw new Error("Payment not confirmed. Please contact support.");

      setToken(purchasedCode);
      setResponse(result.data?.response_description);
      setStep("success");
      console.log(result.data);
    } catch (err: Error | unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Payment failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentConfirmation = async (id: string) => {
    const res = await fetch("/api/queryPaymentStatus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        request_id: id,
      }),
    });

    const data = await res.json();
    const confirmed = data.data?.status.toLowerCase() === "delivered";

    console.log(id);
    console.log(res);
    return { confirmed };
  };

  const reset = () => {
    setStep("verify");
    setMeterNo("");
    setAmount(null);
    setPhone("");
    setEmail("");
    setToken("");
    setCustomerName("");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl p-6 relative">
        <button
          onClick={reset}
          className="absolute top-4 right-4 text-gray-400 cursor-pointer"
        >
          <X />
        </button>

        {step === "verify" && (
          <form onSubmit={handleVerify} className="space-y-4">
            <h2 className="text-white text-xl font-bold">Verify Meter</h2>

            <div className="flex bg-gray-800 rounded-xl p-1">
              {["prepaid", "postpaid"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMeterType(type);
                  }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg cursor-pointer transition-all
            ${
              meterType === type
                ? "bg-blue-600 text-white shadow"
                : "text-gray-400 hover:text-white"
            }
          `}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>

            {error && <p className="text-red-400">{error}</p>}

            <input
              required
              placeholder="Meter Number"
              value={meterNo}
              onChange={(e) => setMeterNo(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 text-white outline-none"
            />

            <button
              disabled={loading || !meterNo}
              className={`w-full bg-blue-600 py-3 rounded cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                "Verify"
              )}
            </button>
          </form>
        )}

        {step === "pay" && (
          <form onSubmit={handlePay} className="space-y-4">
            <p className="text-green-400 font-bold">{customerName}</p>

            {error && <p className="text-red-400 capitalize">{error}</p>}

            <input
              required
              type="number"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 text-white"
            />

            <input
              required
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 text-white"
            />

            <input
              required
              placeholder="Amount"
              type="number"
              min={500}
              value={amount || ""}
              onChange={(e) =>
                setAmount(e.target.value ? Number(e.target.value) : null)
              }
              className="w-full p-3 rounded bg-gray-800 text-white"
            />

            <button
              disabled={loading || !amount}
              className={`w-full bg-green-600 py-3 rounded cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                `Pay ₦${amount ?? 0}`
              )}
            </button>
          </form>
        )}

        {step === "success" && (
          <>
            {meterType.toLowerCase() === "prepaid" ? (
              <div className="text-center space-y-4">
                <CheckCircle size={48} className="mx-auto text-green-500" />
                <p className="text-white">Token</p>
                <p className="text-green-400 font-mono break-all tracking-widest text-lg">
                  {" "}
                  {formatToken(token)}
                </p>

                <div className="flex gap-4 items-center mt-8">
                  <button
                    onClick={copyToken}
                    className="w-full flex items-center justify-center gap-2 cursor-pointer bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition"
                  >
                    {copied ? "Copied ✓" : "Copy Token"}
                  </button>

                  <button
                    onClick={reset}
                    className="bg-green-600 w-full py-3 rounded cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <CheckCircle size={48} className="mx-auto text-green-500" />
                <p className="text-white">{response}</p>

                <button
                  onClick={reset}
                  className="bg-green-600 w-full py-3 rounded cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
