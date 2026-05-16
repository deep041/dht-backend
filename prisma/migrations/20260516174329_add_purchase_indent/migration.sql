-- CreateTable
CREATE TABLE "PurchaseIndent" (
    "id" SERIAL NOT NULL,
    "prApprovalPath" TEXT NOT NULL DEFAULT 'Default Path For Indent',
    "departmentId" INTEGER,
    "refSalesOrderId" INTEGER,
    "refProdPlnNo" TEXT,
    "indentDate" TIMESTAMP(3) NOT NULL,
    "plantUnitId" INTEGER,
    "typeOfPr" TEXT,
    "docAttachmentRequired" BOOLEAN NOT NULL DEFAULT false,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseIndent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseIndentLineItem" (
    "id" SERIAL NOT NULL,
    "purchaseIndentId" INTEGER NOT NULL,
    "itemId" INTEGER,
    "description" TEXT,
    "qty" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unitId" INTEGER,
    "requiredDate" TIMESTAMP(3),
    "suggestedVendorId" INTEGER,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseIndentLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PurchaseIndent_indentDate_idx" ON "PurchaseIndent"("indentDate");

-- CreateIndex
CREATE INDEX "PurchaseIndent_departmentId_idx" ON "PurchaseIndent"("departmentId");

-- CreateIndex
CREATE INDEX "PurchaseIndentLineItem_purchaseIndentId_idx" ON "PurchaseIndentLineItem"("purchaseIndentId");

-- AddForeignKey
ALTER TABLE "PurchaseIndent" ADD CONSTRAINT "PurchaseIndent_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseIndent" ADD CONSTRAINT "PurchaseIndent_refSalesOrderId_fkey" FOREIGN KEY ("refSalesOrderId") REFERENCES "SalesOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseIndent" ADD CONSTRAINT "PurchaseIndent_plantUnitId_fkey" FOREIGN KEY ("plantUnitId") REFERENCES "PlantUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseIndentLineItem" ADD CONSTRAINT "PurchaseIndentLineItem_purchaseIndentId_fkey" FOREIGN KEY ("purchaseIndentId") REFERENCES "PurchaseIndent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseIndentLineItem" ADD CONSTRAINT "PurchaseIndentLineItem_suggestedVendorId_fkey" FOREIGN KEY ("suggestedVendorId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
