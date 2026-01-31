"use client";

import PaymentStatusPage from "@/components/PaymentStatus";
import { Suspense } from "react";

export default function PaymentStatusWrapper() {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
      <PaymentStatusPage />
    </Suspense>
  );
}
