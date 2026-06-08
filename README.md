# ScaleKit

ScaleKit is an independent digital-product platform for research, SEO,
performance, conversion, automation, integrations, themes, and technical
utilities.

## Core flow

1. A customer browses the product catalogue.
2. Products are added to the cart.
3. Checkout prices are calculated in NGN from the USD catalogue.
4. Paystack or Flutterwave processes payment.
5. The server verifies the provider response.
6. Secure product access is delivered to the payment email.
7. The customer verifies access through an OTP or secure link.
8. The protected product package becomes available.

## Local setup

```bash
pnpm install
copy .env.example .env.local
pnpm db:deploy
pnpm dev
```

## Validation

```bash
pnpm lint
pnpm build
```

## Production

The project requires PostgreSQL, payment-provider credentials, Resend email
delivery, a strong product-access cookie secret, and the production APP_URL.
See `.env.example` for the complete variable list.