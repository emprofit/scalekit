import crypto from "node:crypto";

export const VAULT_DOWNLOAD_ACCESS_COOKIE = "vault_download_access";

type VaultAccessPayload = {
  grantIds: string[];
  email: string;
  exp: number;
};

function getSecret() {
  const secret = process.env.VAULT_DOWNLOAD_COOKIE_SECRET;
  if (!secret) {
    throw new Error("VAULT_DOWNLOAD_COOKIE_SECRET is not configured.");
  }
  return secret;
}

function base64url(input: string | Buffer) {
  return Buffer.from(input).toString("base64url");
}

function sign(value: string) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(value)
    .digest("base64url");
}

export function createVaultAccessCookieValue(payload: VaultAccessPayload) {
  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function readVaultAccessCookieValue(rawValue?: string | null) {
  if (!rawValue) return null;

  const [encodedPayload, signature] = rawValue.split(".");
  if (!encodedPayload || !signature) return null;

  const expected = sign(encodedPayload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);

  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as VaultAccessPayload;

    if (!payload.exp || payload.exp * 1000 < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function buildVaultAccessCookie(grantIds: string[], email: string) {
  const exp = Math.floor(Date.now() / 1000) + 20 * 60;

  return {
    value: createVaultAccessCookieValue({
      grantIds,
      email: email.toLowerCase(),
      exp,
    }),
    expires: new Date(exp * 1000),
  };
}
