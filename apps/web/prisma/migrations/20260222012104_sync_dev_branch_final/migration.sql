/*
  Warnings:

  - The `balance` column on the `Bill` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `discountTotal` column on the `Bill` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `subtotal` column on the `Bill` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `taxTotal` column on the `Bill` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `total` column on the `Bill` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `taxAmount` column on the `BillItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `discount` column on the `BillItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `taxRate` column on the `BillItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `userId` on the `Company` table. All the data in the column will be lost.
  - The `cost` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `basePrice` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `finalPrice` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[companyId,identificationNumber]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subtotal` to the `BillItem` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `total` on the `BillItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `price` on the `BillItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `companyId` to the `CategoryProduct` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `InventoryMovement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `amount` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `basePrice` on the `ProductPrice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `value` on the `ProductPrice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ADMIN', 'ACCOUNTANT', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('IN', 'OUT', 'ADJUSTMENT', 'TRANSFER');

-- CreateEnum
CREATE TYPE "DianStatus" AS ENUM ('PENDING', 'SENT', 'ACCEPTED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_userId_fkey";

-- DropIndex
DROP INDEX "Client_identificationNumber_key";

-- DropIndex
DROP INDEX "Company_userId_key";

-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "acceptedAt" TIMESTAMP(3),
ADD COLUMN     "cufe" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "dianResponse" TEXT,
ADD COLUMN     "dianStatus" "DianStatus",
ADD COLUMN     "pdfUrl" TEXT,
ADD COLUMN     "rejectedReason" TEXT,
ADD COLUMN     "sentAt" TIMESTAMP(3),
ADD COLUMN     "xml" TEXT,
DROP COLUMN "balance",
ADD COLUMN     "balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
DROP COLUMN "discountTotal",
ADD COLUMN     "discountTotal" DECIMAL(65,30) NOT NULL DEFAULT 0,
DROP COLUMN "subtotal",
ADD COLUMN     "subtotal" DECIMAL(65,30) NOT NULL DEFAULT 0,
DROP COLUMN "taxTotal",
ADD COLUMN     "taxTotal" DECIMAL(65,30) NOT NULL DEFAULT 0,
DROP COLUMN "total",
ADD COLUMN     "total" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "BillItem" ADD COLUMN     "subtotal" DECIMAL(65,30) NOT NULL,
DROP COLUMN "taxAmount",
ADD COLUMN     "taxAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
DROP COLUMN "total",
ADD COLUMN     "total" DECIMAL(65,30) NOT NULL,
DROP COLUMN "discount",
ADD COLUMN     "discount" DECIMAL(65,30) NOT NULL DEFAULT 0,
DROP COLUMN "price",
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL,
DROP COLUMN "taxRate",
ADD COLUMN     "taxRate" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "CategoryProduct" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "userId",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "InventoryMovement" DROP COLUMN "type",
ADD COLUMN     "type" "MovementType" NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "amount",
ADD COLUMN     "amount" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "deletedAt" TIMESTAMP(3),
DROP COLUMN "cost",
ADD COLUMN     "cost" DECIMAL(65,30),
DROP COLUMN "basePrice",
ADD COLUMN     "basePrice" DECIMAL(65,30),
DROP COLUMN "finalPrice",
ADD COLUMN     "finalPrice" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "ProductPrice" DROP COLUMN "basePrice",
ADD COLUMN     "basePrice" DECIMAL(65,30) NOT NULL,
DROP COLUMN "value",
ADD COLUMN     "value" DECIMAL(65,30) NOT NULL;

-- DropEnum
DROP TYPE "InventoryMovementType";

-- CreateTable
CREATE TABLE "UserCompany" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'EMPLOYEE',

    CONSTRAINT "UserCompany_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserCompany_userId_companyId_key" ON "UserCompany"("userId", "companyId");

-- CreateIndex
CREATE INDEX "Bill_companyId_idx" ON "Bill"("companyId");

-- CreateIndex
CREATE INDEX "Bill_createdAt_idx" ON "Bill"("createdAt");

-- CreateIndex
CREATE INDEX "Bill_status_idx" ON "Bill"("status");

-- CreateIndex
CREATE INDEX "Bill_deletedAt_idx" ON "Bill"("deletedAt");

-- CreateIndex
CREATE INDEX "CategoryProduct_companyId_idx" ON "CategoryProduct"("companyId");

-- CreateIndex
CREATE INDEX "Client_companyId_idx" ON "Client"("companyId");

-- CreateIndex
CREATE INDEX "Client_identificationNumber_idx" ON "Client"("identificationNumber");

-- CreateIndex
CREATE INDEX "Client_deletedAt_idx" ON "Client"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Client_companyId_identificationNumber_key" ON "Client"("companyId", "identificationNumber");

-- CreateIndex
CREATE INDEX "Company_deletedAt_idx" ON "Company"("deletedAt");

-- CreateIndex
CREATE INDEX "Product_companyId_idx" ON "Product"("companyId");

-- CreateIndex
CREATE INDEX "Product_code_idx" ON "Product"("code");

-- CreateIndex
CREATE INDEX "Product_deletedAt_idx" ON "Product"("deletedAt");

-- AddForeignKey
ALTER TABLE "UserCompany" ADD CONSTRAINT "UserCompany_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCompany" ADD CONSTRAINT "UserCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryProduct" ADD CONSTRAINT "CategoryProduct_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
