-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('NATURAL_PERSON', 'LEGAL_ENTITY', 'COMPANY');

-- CreateEnum
CREATE TYPE "IdentificationType" AS ENUM ('CITIZEN_ID', 'PASSPORT', 'TAX_ID', 'FOREIGN_ID');

-- CreateEnum
CREATE TYPE "VatCondition" AS ENUM ('RESPONSABLE', 'NO_RESPONSABLE', 'EXENTO', 'SIMPLIFIED_REGIME');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyName" TEXT NOT NULL,
    "accountId" TEXT,
    "commercialName" TEXT,
    "organizationType" "OrganizationType" NOT NULL,
    "vatCondition" "VatCondition" NOT NULL,
    "identificationNumber" TEXT NOT NULL,
    "verificationDigit" TEXT,
    "lastAccountingClose" TIMESTAMP(3),
    "economicActivity" TEXT,
    "industryAndCommerceTax" BOOLEAN NOT NULL DEFAULT false,
    "address" TEXT NOT NULL,
    "department" TEXT,
    "municipality" TEXT,
    "postalCode" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "organizationType" "OrganizationType" NOT NULL,
    "firstLastName" TEXT NOT NULL,
    "secondLastName" TEXT,
    "firstName" TEXT NOT NULL,
    "otherNames" TEXT,
    "commercialName" TEXT,
    "code" TEXT,
    "identificationType" "IdentificationType" NOT NULL,
    "identificationNumber" TEXT NOT NULL,
    "email" TEXT,
    "includeCcBcc" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT,
    "country" TEXT NOT NULL,
    "department" TEXT,
    "municipality" TEXT,
    "postalCode" TEXT,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bill" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_userId_key" ON "Company"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_identificationNumber_key" ON "Client"("identificationNumber");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
