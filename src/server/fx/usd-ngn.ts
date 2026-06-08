type ExchangeRatePayload = {
  result?: string;
  conversion_rates?: Record<string, number>;
  rates?: Record<string, number>;
  time_last_update_unix?: number;
  time_last_update_utc?: string;
};

export type UsdNgnRate = {
  rate: number;
  provider: string;
  updatedAt: string;
};

const DEFAULT_FX_URL = "https://open.er-api.com/v6/latest/USD";

export async function getUsdNgnRate(): Promise<UsdNgnRate> {
  const url = process.env.FX_API_URL?.trim() || DEFAULT_FX_URL;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate: 21600,
    },
  });

  if (!response.ok) {
    throw new Error(`Unable to retrieve the USD/NGN rate (${response.status}).`);
  }

  const payload = (await response.json()) as ExchangeRatePayload;
  const rate =
    payload.conversion_rates?.NGN ??
    payload.rates?.NGN;

  if (!Number.isFinite(rate) || Number(rate) <= 0) {
    throw new Error("The FX provider returned an invalid USD/NGN rate.");
  }

  let provider = "Configured FX provider";

  try {
    provider = new URL(url).hostname;
  } catch {
    // Keep the generic provider label for non-standard configured URLs.
  }

  const updatedAt = payload.time_last_update_unix
    ? new Date(payload.time_last_update_unix * 1000).toISOString()
    : payload.time_last_update_utc
      ? new Date(payload.time_last_update_utc).toISOString()
      : new Date().toISOString();

  return {
    rate: Number(rate),
    provider,
    updatedAt,
  };
}

export function convertUsdCentsToNgn(
  priceUsdCents: number,
  usdNgnRate: number,
) {
  if (!Number.isInteger(priceUsdCents) || priceUsdCents < 0) {
    throw new Error("Invalid USD product price.");
  }

  if (!Number.isFinite(usdNgnRate) || usdNgnRate <= 0) {
    throw new Error("Invalid USD/NGN rate.");
  }

  return Math.ceil((priceUsdCents / 100) * usdNgnRate);
}