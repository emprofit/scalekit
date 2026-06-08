import { Suspense } from "react";

import PaystackSuccessClient from "./paystack-success-client";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PaystackSuccessClient />
    </Suspense>
  );
}
