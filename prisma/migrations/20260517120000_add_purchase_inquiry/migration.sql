-- AlterEnum
ALTER TYPE "ItemTransactionSource" ADD VALUE 'PURCHASE_INQUIRY';

-- CreateTable
CREATE TABLE "PurchaseInquiry" (
    "id" SERIAL NOT NULL,
    "approvalPath" TEXT NOT NULL DEFAULT 'Default Path For Purchase Enquiry',
    "refSalesOrderId" INTEGER,
    "refProductionNo" TEXT,
    "suppliers" TEXT,
    "enquiryDate" TIMESTAMP(3) NOT NULL,
    "requiredDeliveryDate" TIMESTAMP(3),
    "validTillDate" TIMESTAMP(3),
    "plantUnitId" INTEGER,
    "refPurchaseIndentId" INTEGER,
    "docAttachmentRequired" BOOLEAN NOT NULL DEFAULT false,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseInquiryLineItem" (
    "id" SERIAL NOT NULL,
    "purchaseInquiryId" INTEGER NOT NULL,
    "itemId" INTEGER,
    "description" TEXT,
    "qty" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unitId" INTEGER,
    "hsnCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseInquiryLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PurchaseInquiry_enquiryDate_idx" ON "PurchaseInquiry"("enquiryDate");

-- CreateIndex
CREATE INDEX "PurchaseInquiry_refPurchaseIndentId_idx" ON "PurchaseInquiry"("refPurchaseIndentId");

-- CreateIndex
CREATE INDEX "PurchaseInquiryLineItem_purchaseInquiryId_idx" ON "PurchaseInquiryLineItem"("purchaseInquiryId");

-- AddForeignKey
ALTER TABLE "PurchaseInquiry" ADD CONSTRAINT "PurchaseInquiry_refSalesOrderId_fkey" FOREIGN KEY ("refSalesOrderId") REFERENCES "SalesOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseInquiry" ADD CONSTRAINT "PurchaseInquiry_plantUnitId_fkey" FOREIGN KEY ("plantUnitId") REFERENCES "PlantUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseInquiry" ADD CONSTRAINT "PurchaseInquiry_refPurchaseIndentId_fkey" FOREIGN KEY ("refPurchaseIndentId") REFERENCES "PurchaseIndent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseInquiryLineItem" ADD CONSTRAINT "PurchaseInquiryLineItem_purchaseInquiryId_fkey" FOREIGN KEY ("purchaseInquiryId") REFERENCES "PurchaseInquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
