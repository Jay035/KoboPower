"use client";

import { useState } from "react";
import { notFound, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { DISCOS } from "@/lib/db";

const DISCO_MAP = Object.fromEntries(
  DISCOS.map((disco) => [
    disco.slug,
    {
      name: disco.name,
      serviceID: disco.serviceID,
      color: disco.color,
    },
  ]),
) as Record<string, { name: string; serviceID: string; color: string }>;

export default function ElectricityPaymentPage() {
  const { disco } = useParams<{ disco: string }>();

  const discoData = DISCO_MAP[disco as string];

  if (!discoData) {
    notFound();
  }

  const NIGERIAN_PHONE_REGEX =
    /^(?:\+234|234|0)(7[0-9]|8[0-9]|9[0-1])[0-9]{8}$/;

  const [step, setStep] = useState<"verify" | "pay">("verify");
  const [meterNo, setMeterNo] = useState("");
  const [meterType, setMeterType] = useState<"prepaid" | "postpaid">("prepaid");

  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [canVend, setCanVend] = useState("yes");
  const [customerArrears, setCustomerArrears] = useState("false");
  const [amount, setAmount] = useState<number | "">("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const fee = 100;
  const totalAmount = Number(amount) + fee;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/verify-meter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meterNo,
          serviceID: discoData.serviceID,
          type: meterType,
        }),
      });

      const data = await res.json();
      console.log(data);
      if (!res.ok) throw new Error(data.message);
      if (data.data.WrongBillersCode)
        throw new Error("Invalid Meter Number. Please check and try again");

      setCustomerName(data.data.Customer_Name);
      setCustomerAddress(data.data.Address);
      setCanVend(data.data.Can_Vend);
      setCustomerArrears(data.data.Customer_Arrears);
      setStep("pay");

      if (data.data.Can_Vend === "no") {
        setError(
          "Cannot vend to this meter. Please contact your electricity provider.",
        );
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Verification failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/init-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meterNo,
          meterType,
          serviceID: discoData.serviceID,
          amount: totalAmount,
          email,
          phone,
          customerName,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      console.log(data);

      window.location.href = data.paymentUrl;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Payment initialization failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex justify-center items-center p-6">
      <div className="w-full rounded-2xl space-y-6">
        <h1 className="text-2xl font-bold">
          {discoData.name} Electricity Payment
        </h1>

        {/* ---------------- VERIFY STEP ---------------- */}
        {step === "verify" && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="flex bg-gray-800 rounded-xl p-1">
              {["prepaid", "postpaid"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMeterType(type as "prepaid" | "postpaid")}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold
                    ${meterType === type ? "bg-blue-600" : "text-gray-400"}`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>

            {error && <p className="text-red-400">{error}</p>}

            <input
              id="meterNumber"
              autoComplete="off"
              required
              placeholder="Meter Number"
              value={meterNo}
              onChange={(e) => setMeterNo(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 outline-none"
            />

            <button
              disabled={loading}
              className="w-full bg-blue-600 py-3 rounded"
            >
              {loading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                "Verify"
              )}
            </button>
          </form>
        )}

        {/* ---------------- PAYMENT STEP ---------------- */}
        {step === "pay" && (
          <form onSubmit={handlePayment} className="space-y-4">
            <p className="text-sm">
              {" "}
              <span className="text-green-400 font-bold text-base">
                {customerName}
              </span>{" "}
              (Please confirm that the name displayed is the correct name for
              your {discoData.name} Meter)
            </p>
            {customerAddress && <p>Address: {customerAddress}</p>}
            {customerArrears && <p>Arrears: {customerArrears}</p>}

            {error && <p className="text-red-400">{error}</p>}
            <div className="">
              <input
                id="phoneNo"
                autoComplete="off"
                required
                inputMode="numeric"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s+/g, "");
                  setPhone(value);

                  if (!NIGERIAN_PHONE_REGEX.test(value)) {
                    setPhoneError("Enter a valid phone number");
                  } else {
                    setPhoneError(null);
                  }
                }}
                className={`w-full p-3 rounded outline-none mt-4 bg-gray-800 ${
                  phoneError ? "border border-red-500" : ""
                }`}
              />

              {phoneError && (
                <p className="text-red-400 text-sm mt-1">{phoneError}</p>
              )}
            </div>

            <input
              id="email"
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 outline-none"
            />

            <input
              required
              id="amount"
              autoComplete="off"
              type="number"
              min={500}
              placeholder="Amount"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value ? Number(e.target.value) : "")
              }
              className="w-full p-3 rounded bg-gray-800 outline-none"
            />

            <p className="text-sm">
              Convenience fee: <span className="font-semibold">₦{fee}</span>
            </p>

            <button
              disabled={
                loading ||
                canVend?.toLowerCase() === "no" ||
                !amount ||
                !!phoneError
              }
              className="w-full bg-green-600 py-3 rounded cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                `Pay ₦${amount ? totalAmount : 0}`
              )}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
