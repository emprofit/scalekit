"use client";

export type VaultCartItem = {
  productId: string;
  addedAt: string;
};

const STORAGE_KEY = "scalekit_cart";
const LEGACY_STORAGE_KEY = "octalve_vault_cart";
const EVENT_NAME = "scalekit-cart-updated";

function isBrowser() {
  return typeof window !== "undefined";
}

function parseCart(raw: string | null): VaultCartItem[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is VaultCartItem =>
        !!item &&
        typeof item === "object" &&
        typeof (item as VaultCartItem).productId === "string" &&
        typeof (item as VaultCartItem).addedAt === "string",
    );
  } catch {
    return [];
  }
}

function migrateLegacyCart() {
  if (!isBrowser()) return;

  const current = window.localStorage.getItem(STORAGE_KEY);
  if (current) return;

  const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
  const parsedLegacy = parseCart(legacy);

  if (parsedLegacy.length > 0) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedLegacy));
  }

  if (legacy !== null) {
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  }
}

export function readVaultCart(): VaultCartItem[] {
  if (!isBrowser()) return [];

  migrateLegacyCart();
  return parseCart(window.localStorage.getItem(STORAGE_KEY));
}

export function writeVaultCart(cart: VaultCartItem[]) {
  if (!isBrowser()) return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function addVaultCartItem(productId: string) {
  const cart = readVaultCart();

  if (cart.some((item) => item.productId === productId)) {
    return;
  }

  writeVaultCart([
    ...cart,
    {
      productId,
      addedAt: new Date().toISOString(),
    },
  ]);
}

export function removeVaultCartItem(productId: string) {
  const cart = readVaultCart();
  writeVaultCart(cart.filter((item) => item.productId !== productId));
}

export function clearVaultCart() {
  writeVaultCart([]);
}

export function vaultCartHasItem(productId: string) {
  return readVaultCart().some((item) => item.productId === productId);
}

export function subscribeVaultCart(callback: () => void) {
  if (!isBrowser()) return () => undefined;

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) callback();
  };

  const handleCustom = () => callback();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(EVENT_NAME, handleCustom);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(EVENT_NAME, handleCustom);
  };
}