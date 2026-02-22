-- AlterEnum
ALTER TYPE "BillStatus" ADD VALUE 'TO_PAY';

-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "listPriceId" TEXT,
ADD COLUMN     "sellerId" TEXT;

-- AlterTable
ALTER TABLE "ListPrice" ADD COLUMN     "percentage" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "billingEmail" TEXT,
ADD COLUMN     "businessType" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "companyLogo" TEXT,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "currency" TEXT DEFAULT 'COP',
ADD COLUMN     "defaultTax" TEXT DEFAULT '19',
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "invoiceInitialNumber" INTEGER DEFAULT 1,
ADD COLUMN     "invoicePrefix" TEXT DEFAULT 'FAC',
ADD COLUMN     "language" TEXT DEFAULT 'es',
ADD COLUMN     "legalName" TEXT,
ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "profileLogo" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "taxIdentification" TEXT,
ADD COLUMN     "taxRegime" TEXT,
ADD COLUMN     "taxResponsibilities" TEXT,
ADD COLUMN     "timezone" TEXT DEFAULT 'America/Bogota',
ADD COLUMN     "userType" TEXT,
ADD COLUMN     "website" TEXT,
ADD COLUMN     "zipCode" TEXT;
