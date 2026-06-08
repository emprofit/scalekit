-- Add a transient delivery state so email dispatch can be claimed atomically.
ALTER TYPE "public"."DeliveryStatus" ADD VALUE IF NOT EXISTS 'PROCESSING';

-- Add webhook deduplication support.
ALTER TABLE "public"."WebhookEvent"
ADD COLUMN IF NOT EXISTS "dedupeKey" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "WebhookEvent_dedupeKey_key"
ON "public"."WebhookEvent"("dedupeKey");