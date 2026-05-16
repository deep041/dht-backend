-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('BILLING', 'SHIPPING');

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "supplyType" TEXT,
    "partyGroupId" INTEGER NOT NULL,
    "companyName" TEXT NOT NULL,
    "legalName" TEXT,
    "panNo" TEXT,
    "contactNo" TEXT,
    "email" TEXT,
    "vendorCode" TEXT,
    "creditPeriodDays" INTEGER,
    "creditLimit" DOUBLE PRECISION,
    "paymentTermId" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerAddress" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "type" "AddressType" NOT NULL,
    "attentionName" TEXT,
    "gstNo" TEXT,
    "addressLine" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "pinCode" TEXT NOT NULL,
    "countryId" INTEGER NOT NULL,
    "stateId" INTEGER NOT NULL,
    "stateCode" TEXT NOT NULL,

    CONSTRAINT "CustomerAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerContactPerson" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "mobileNo" TEXT,
    "email" TEXT,
    "designation" TEXT,

    CONSTRAINT "CustomerContactPerson_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerContactPerson" ADD CONSTRAINT "CustomerContactPerson_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
