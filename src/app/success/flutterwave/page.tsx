import { Suspense } from "react";

import FlutterwaveSuccessClient from "./flutterwave-success-client";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <FlutterwaveSuccessClient />
    </Suspense>
  );
}
