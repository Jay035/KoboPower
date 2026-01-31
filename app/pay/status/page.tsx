"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, LoaderCircle } from "lucide-react";
// import { doc, onSnapshot } from "firebase/firestore";
// import { db } from "@/lib/firebaseClient";

function formatToken(token: string): string {
  return token?.replace(/(.{4})/g, "$1-").replace(/-$/, "");
}

export default function PaymentStatusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRef = searchParams.get("paymentReference");
  const paymentRef = rawRef?.split("?")[0];

  const [meterType, setMeterType] = useState("prepaid");
  const [status, setStatus] = useState("Processing payment...");
  const [token, setToken] = useState("");
  const [isSlow, setIsSlow] = useState(false);

  const reroute = () => {
    router.push("/#discos");
  };

  useEffect(() => {
    if (!paymentRef) return;
    // const txRef = doc(db, "transactions", rawRef!);
    const resolvedRef = { current: false };
    let intervalId: NodeJS.Timeout | null = null;

    const poll = async () => {
      if (resolvedRef.current) return;
      try {
        const res = await fetch(
          `/api/transactions?paymentReference=${paymentRef}`,
        );
        const tx = await res.json();

        if (!tx) return;
        setMeterType(tx.meterType);
        console.log("Polled transaction:", tx);

        if (tx.status === "success") {
          console.log("tx", tx);
          resolvedRef.current = true;
          setStatus(tx.status);
          setToken(tx.token);
          if (!tx.token) setStatus("failed");

          if (intervalId) clearInterval(intervalId);
          return;
        }

        if (["failed", "vend_failed"].includes(tx.status)) {
          setStatus("failed");
          resolvedRef.current = true;
          if (intervalId) clearInterval(intervalId);
          return;
        }

        if (["failed", "vend_failed"].includes(tx.status)) {
          setStatus("failed");
        }
      } catch (err) {
        console.error(err);
      }
    };

    poll();

    intervalId = setInterval(poll, 6000);

    const slowTimer = setTimeout(() => {
      if (!resolvedRef.current) {
        setIsSlow(true);
      }
    }, 20000);

    // const unsubscribe = onSnapshot(
    //   txRef,
    //   (snap) => {
    //     if (!snap.exists()) {
    //       console.log("Transaction doc does not exist yet.");
    //       return;
    //     }

    //     const tx = snap.data();
    //     console.log("Realtime tx:", tx);

    //     setMeterType(tx.meterType ?? "prepaid");

    //     // ✅ SUCCESS
    //     if (tx.status === "success") {
    //       clearTimeout(slowTimer);
    //       resolvedRef.current = true;
    //       setToken(tx.token ?? "");
    //       setStatus("success");
    //       unsubscribe();
    //       return;
    //     }

    //     if (
    //       tx.status === "success" &&
    //       tx.meterType === "prepaid" &&
    //       !tx.token
    //     ) {
    //       // wait a bit, maybe webhook hasn't updated yet
    //       console.warn("Success but token missing.");
    //       return;
    //     }

    //     // ❌ FAILURE STATES
    //     if (["failed", "vend_failed"].includes(tx.status)) {
    //       // resolved = true;
    //       clearTimeout(slowTimer);
    //       resolvedRef.current = true;
    //       setStatus("failed");
    //       unsubscribe();
    //       return;
    //     }

    //     // ⏳ Still processing
    //     // setStatus("Processing payment...");
    //   },
    //   (err) => {
    //     console.error("Snapshot error:", err);
    //     // setStatus("failed");
    //   },
    // );

    return () => {
      if (intervalId) clearInterval(intervalId);
      clearTimeout(slowTimer);
      // unsubscribe();
    };
  }, [paymentRef]);

  return (
    <div className="p-8 text-white flex items-center justify-center min-h-screen">
      {status === "Processing payment..." && (
        <div className="text-center max-w-sm">
          <LoaderCircle className="mx-auto animate-spin mb-3" />
          <p>
            {isSlow
              ? "This is taking longer than usual. Please don’t close this page."
              : "Processing payment..."}
          </p>

          {isSlow && (
            <p className="text-sm text-gray-400 mt-2">
              We’re still confirming your payment.
            </p>
          )}
        </div>
      )}

      {status === "success" &&
        (meterType === "prepaid" ? (
          <PrepaidSuccess token={token} onSuccess={reroute} />
        ) : (
          <PostpaidSuccess onSuccess={reroute} />
        ))}

      {status === "failed" && (
        <div className="text-red-400 text-center">Payment failed!</div>
      )}
    </div>
  );
}

const PrepaidSuccess = ({
  token,
  onSuccess,
}: {
  token: string;
  onSuccess: () => void;
}) => {
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

  return (
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
          onClick={onSuccess}
          className="bg-green-600 w-full py-3 rounded cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};

const PostpaidSuccess = ({ onSuccess }: { onSuccess: () => void }) => {
  return (
    <div className="text-center space-y-4">
      <CheckCircle size={48} className="mx-auto text-green-500" />
      <p className="text-white">
        Payment successful. Your bill has been settled.
      </p>

      <button
        onClick={onSuccess}
        className="bg-green-600 w-full py-3 rounded cursor-pointer"
      >
        Done
      </button>
    </div>
  );
};
