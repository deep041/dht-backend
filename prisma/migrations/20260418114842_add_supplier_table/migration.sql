-- CreateEnum
CREATE TYPE "TypeOfConcern" AS ENUM ('PROPRIETORY', 'PARTNERSHIP', 'PVT_LTD', 'LTD');

-- CreateEnum
CREATE TYPE "GstRegistrationType" AS ENUM ('REGULAR', 'UNREGISTERED', 'COMPOSITION', 'CONSUMER');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('CURRENT', 'SAVING');

-- CreateEnum
CREATE TYPE "BalanceType" AS ENUM ('CREDIT', 'DEBIT');

-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "partyGroupId" INTEGER NOT NULL,
    "companyName" TEXT NOT NULL,
    "legalName" TEXT,
    "gstNo" TEXT,
    "panNo" TEXT,
    "typeOfConcern" "TypeOfConcern" NOT NULL,
    "gstRegistrationType" "GstRegistrationType" NOT NULL,
    "vendorCode" TEXT,
    "contactNo" TEXT,
    "email" TEXT,
    "addressLine1" TEXT,
    "place" TEXT,
    "pinCode" TEXT,
    "countryId" INTEGER NOT NULL,
    "stateId" INTEGER NOT NULL,
    "stateCode" TEXT,
    "website" TEXT,
    "creditPeriodDays" INTEGER,
    "creditLimit" DOUBLE PRECISION,
    "paymentTermId" INTEGER,
    "note" TEXT,
    "openingAmount" DOUBLE PRECISION,
    "balanceType" "BalanceType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierContactPerson" (
    "id" SERIAL NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "mobileNo" TEXT,
    "email" TEXT,
    "designation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupplierContactPerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierBankAccount" (
    "id" SERIAL NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNo" TEXT NOT NULL,
    "accountType" "AccountType" NOT NULL,
    "branchCode" TEXT,
    "branchName" TEXT,
    "branchAddress" TEXT,
    "ifscCode" TEXT,
    "swiftCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupplierBankAccount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_partyGroupId_fkey" FOREIGN KEY ("partyGroupId") REFERENCES "PartyGroups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_paymentTermId_fkey" FOREIGN KEY ("paymentTermId") REFERENCES "PaymentTerms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierContactPerson" ADD CONSTRAINT "SupplierContactPerson_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierBankAccount" ADD CONSTRAINT "SupplierBankAccount_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
