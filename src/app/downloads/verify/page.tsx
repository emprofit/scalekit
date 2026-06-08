type VerifyPageProps = {
  searchParams: Promise<{
    grant?: string;
    token?: string;
    error?: string;
    resent?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  "invalid-link": "The secure link is invalid or has expired.",
  "invalid-otp": "The email or OTP code could not be verified.",
  "missing-grant": "The product-access record could not be found.",
  "email-not-configured": "Email delivery is temporarily unavailable.",
  "email-send-failed": "The verification email could not be sent.",
  "wait-before-resend": "Please wait one minute before requesting another email.",
};

export default async function ScaleKitDownloadsVerifyPage({
  searchParams,
}: VerifyPageProps) {
  const params = await searchParams;
  const grant = params.grant ?? "";
  const token = params.token ?? "";
  const error = params.error ?? "";
  const resent = params.resent === "1";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-[760px] rounded-[32px] border border-slate-200 bg-white p-8 md:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#0064E0]">
          ScaleKit Product Access
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl">
          Verify your payment email
        </h1>

        <p className="mt-4 text-base leading-8 text-slate-600">
          Use the secure magic link from your email or enter the OTP sent to
          the email used at checkout.
        </p>

        {error ? (
          <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessages[error] || "Verification failed. Please try again."}
          </p>
        ) : null}

        {resent ? (
          <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            A fresh OTP and secure link have been sent.
          </p>
        ) : null}

        {grant && token ? (
          <form
            action="/api/vault/downloads/verify-link"
            method="POST"
            className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6"
          >
            <input type="hidden" name="grantId" value={grant} />
            <input type="hidden" name="token" value={token} />

            <h2 className="text-lg font-semibold text-slate-950">
              Secure-link verification
            </h2>

            <p className="mt-2 text-sm leading-7 text-slate-600">
              Continue with the protected link delivered to your email.
            </p>

            <button
              type="submit"
              className="mt-4 inline-flex rounded-full bg-[#0064E0] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0057C7]"
            >
              Verify secure link
            </button>
          </form>
        ) : null}

        {grant ? (
          <>
            <form
              action="/api/vault/downloads/verify-otp"
              method="POST"
              className="mt-8 rounded-3xl border border-slate-200 bg-white p-6"
            >
              <input type="hidden" name="grantId" value={grant} />

              <h2 className="text-lg font-semibold text-slate-950">
                OTP verification
              </h2>

              <label className="mt-4 block text-sm font-medium text-slate-700">
                Payment email
              </label>

              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#0064E0]"
              />

              <label className="mt-4 block text-sm font-medium text-slate-700">
                OTP code
              </label>

              <input
                name="otp"
                type="text"
                inputMode="numeric"
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#0064E0]"
              />

              <button
                type="submit"
                className="mt-4 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Verify OTP
              </button>
            </form>

            <form
              action="/api/vault/downloads/resend"
              method="POST"
              className="mt-4"
            >
              <input type="hidden" name="grantId" value={grant} />

              <button
                type="submit"
                className="text-sm font-medium text-[#0064E0] transition hover:text-[#0057C7]"
              >
                Resend verification email
              </button>
            </form>
          </>
        ) : null}
      </div>
    </main>
  );
}