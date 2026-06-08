import Link from "next/link";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import {
  readVaultAccessCookieValue,
  VAULT_DOWNLOAD_ACCESS_COOKIE,
} from "@/server/vault/access-cookie";

export default async function ScaleKitDownloadsReadyPage() {
  const cookieStore = await cookies();
  const rawCookie = cookieStore.get(VAULT_DOWNLOAD_ACCESS_COOKIE)?.value;
  const access = readVaultAccessCookieValue(rawCookie);

  if (!access) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-[760px] rounded-[32px] border border-slate-200 bg-white p-8 md:p-10">
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl">
            Verification required
          </h1>

          <p className="mt-4 text-base leading-8 text-slate-600">
            Your secure product-access session is missing or has expired.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex rounded-full bg-[#0064E0] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0057C7]"
          >
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const grants = await prisma.downloadGrant.findMany({
    where: {
      id: {
        in: access.grantIds,
      },
      email: access.email,
      revokedAt: null,
    },
    include: {
      orderItem: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-[860px] rounded-[32px] border border-slate-200 bg-white p-8 md:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#0064E0]">
          ScaleKit Product Access
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl">
          Your product access is ready
        </h1>

        <p className="mt-4 text-base leading-8 text-slate-600">
          Verified for {access.email}. This secure session will expire
          automatically.
        </p>

        <div className="mt-8 space-y-4">
          {grants.map((grant) => (
            <div
              key={grant.id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
            >
              <h2 className="text-lg font-semibold text-slate-950">
                {grant.orderItem.productTitle}
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                Access count: {grant.downloadCount}
              </p>

              <a
                href={`/api/vault/download/${grant.token}`}
                className="mt-4 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Access product package
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}