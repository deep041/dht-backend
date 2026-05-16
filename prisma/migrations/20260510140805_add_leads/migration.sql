-- CreateTable
CREATE TABLE "Lead" (
    "id" SERIAL NOT NULL,
    "leadType" TEXT NOT NULL,
    "leadStatus" TEXT NOT NULL,
    "leadSource" TEXT NOT NULL,
    "leadStage" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "position" TEXT,
    "gstNo" TEXT,
    "email" TEXT,
    "contactNo" TEXT,
    "website" TEXT,
    "industry" TEXT,
    "countryId" INTEGER,
    "stateId" INTEGER,
    "city" TEXT,
    "pinCode" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "regionId" INTEGER,
    "zoneId" INTEGER,
    "subZoneId" INTEGER,
    "assignedEmployeeId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadItem" (
    "id" SERIAL NOT NULL,
    "leadId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "description" TEXT,
    "qty" DOUBLE PRECISION,

    CONSTRAINT "LeadItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LeadItem" ADD CONSTRAINT "LeadItem_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
