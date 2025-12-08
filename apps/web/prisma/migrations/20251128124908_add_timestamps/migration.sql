/*
  Warnings:

  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_userId_fkey";

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "companyName" SET DEFAULT '',
ALTER COLUMN "accountId" SET DEFAULT '',
ALTER COLUMN "commercialName" SET DEFAULT '',
ALTER COLUMN "organizationType" SET DEFAULT 'COMPANY',
ALTER COLUMN "vatCondition" SET DEFAULT 'SIMPLIFIED_REGIME',
ALTER COLUMN "identificationNumber" SET DEFAULT '',
ALTER COLUMN "verificationDigit" SET DEFAULT '',
ALTER COLUMN "economicActivity" SET DEFAULT '',
ALTER COLUMN "address" SET DEFAULT '',
ALTER COLUMN "department" SET DEFAULT '',
ALTER COLUMN "municipality" SET DEFAULT '',
ALTER COLUMN "postalCode" SET DEFAULT '',
ALTER COLUMN "phone" SET DEFAULT '',
ALTER COLUMN "email" SET DEFAULT '';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
