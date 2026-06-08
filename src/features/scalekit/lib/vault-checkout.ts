"use client";

const CHECKOUT_EMAIL_KEY = "scalekit_checkout_email";
const LEGACY_CHECKOUT_EMAIL_KEY = "octalve_vault_checkout_email";

function isBrowser() {
  return typeof window !== "undefined";
}

export function readVaultCheckoutEmail() {
  if (!isBrowser()) return "";

  const current = window.localStorage.getItem(CHECKOUT_EMAIL_KEY);
  if (current) return current;

  const legacy = window.localStorage.getItem(LEGACY_CHECKOUT_EMAIL_KEY) || "";

  if (legacy) {
    window.localStorage.setItem(CHECKOUT_EMAIL_KEY, legacy);
  }

  if (window.localStorage.getItem(LEGACY_CHECKOUT_EMAIL_KEY) !== null) {
    window.localStorage.removeItem(LEGACY_CHECKOUT_EMAIL_KEY);
  }

  return legacy;
}

export function writeVaultCheckoutEmail(email: string) {
  if (!isBrowser()) return;

  window.localStorage.setItem(CHECKOUT_EMAIL_KEY, email);
}

export function clearVaultCheckoutEmail() {
  if (!isBrowser()) return;

  window.localStorage.removeItem(CHECKOUT_EMAIL_KEY);
  window.localStorage.removeItem(LEGACY_CHECKOUT_EMAIL_KEY);
}