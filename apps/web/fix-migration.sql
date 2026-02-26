-- Fix Seller: add columns safely with backfill for existing rows
ALTER TABLE "Seller" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Seller" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
ALTER TABLE "Seller" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3);
UPDATE "Seller" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
ALTER TABLE "Seller" ALTER COLUMN "updatedAt" SET NOT NULL;

-- Fix Store: same pattern
ALTER TABLE "Store" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Store" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
ALTER TABLE "Store" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3);
UPDATE "Store" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
ALTER TABLE "Store" ALTER COLUMN "updatedAt" SET NOT NULL;

-- Create ActivityLog table
CREATE TABLE IF NOT EXISTS "ActivityLog" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "changes" JSONB,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX IF NOT EXISTS "ActivityLog_companyId_idx" ON "ActivityLog"("companyId");
CREATE INDEX IF NOT EXISTS "ActivityLog_entityType_entityId_idx" ON "ActivityLog"("entityType", "entityId");
CREATE INDEX IF NOT EXISTS "ActivityLog_userId_idx" ON "ActivityLog"("userId");
CREATE INDEX IF NOT EXISTS "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");
CREATE INDEX IF NOT EXISTS "Seller_companyId_idx" ON "Seller"("companyId");
CREATE INDEX IF NOT EXISTS "Seller_deletedAt_idx" ON "Seller"("deletedAt");
CREATE INDEX IF NOT EXISTS "Store_companyId_idx" ON "Store"("companyId");
CREATE INDEX IF NOT EXISTS "Store_deletedAt_idx" ON "Store"("deletedAt");

-- Foreign keys (use DO block to avoid error if already exists)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'ActivityLog_companyId_fkey'
  ) THEN
    ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_companyId_fkey"
      FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'ActivityLog_userId_fkey'
  ) THEN
    ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
