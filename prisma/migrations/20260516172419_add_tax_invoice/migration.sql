-- CreateTable
CREATE TABLE "TaxInvoice" (
    "id" SERIAL NOT NULL,
    "supplyType" TEXT,
    "plantUnitId" INTEGER,
    "warehouseId" INTEGER,
    "customerId" INTEGER NOT NULL,
    "contactPersonId" INTEGER,
    "billingAddressText" TEXT,
    "gstNo" TEXT,
    "shippingAddressId" INTEGER,
    "shippingAddressText" TEXT,
    "invoiceNo" TEXT NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "customerPoNo" TEXT,
    "customerPoDate" TIMESTAMP(3),
    "refSalesOrderId" INTEGER,
    "salesOrderNo" TEXT,
    "salesOrderDate" TIMESTAMP(3),
    "despatchDocNo" TEXT,
    "paymentTermId" INTEGER,
    "despatchThrough" TEXT,
    "destination" TEXT,
    "bankAccountId" INTEGER,
    "dueDate" TIMESTAMP(3),
    "remarks" TEXT,
    "ewayBillDetails" TEXT,
    "grossAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cgstAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sgstAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "igstAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "shippingCharge" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tcsAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "roundOff" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "roundOffEnabled" BOOLEAN NOT NULL DEFAULT false,
    "grandTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "termsAndConditions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxInvoiceLineItem" (
    "id" SERIAL NOT NULL,
    "taxInvoiceId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "itemDetails" TEXT,
    "description" TEXT,
    "customerItemCode" TEXT,
    "unitId" INTEGER,
    "hsnCode" TEXT,
    "qty" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxableAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cgstRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cgstAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sgstRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sgstAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "igstRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "igstAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lineTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "refSalesOrderNo" TEXT,
    "refJwoinNo" TEXT,
    "refChallanNo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxInvoiceLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaxInvoice_customerId_idx" ON "TaxInvoice"("customerId");

-- CreateIndex
CREATE INDEX "TaxInvoice_invoiceDate_idx" ON "TaxInvoice"("invoiceDate");

-- CreateIndex
CREATE INDEX "TaxInvoice_invoiceNo_idx" ON "TaxInvoice"("invoiceNo");

-- CreateIndex
CREATE INDEX "TaxInvoiceLineItem_taxInvoiceId_idx" ON "TaxInvoiceLineItem"("taxInvoiceId");

-- AddForeignKey
ALTER TABLE "TaxInvoice" ADD CONSTRAINT "TaxInvoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxInvoice" ADD CONSTRAINT "TaxInvoice_contactPersonId_fkey" FOREIGN KEY ("contactPersonId") REFERENCES "CustomerContactPerson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxInvoice" ADD CONSTRAINT "TaxInvoice_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES "CustomerAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxInvoice" ADD CONSTRAINT "TaxInvoice_plantUnitId_fkey" FOREIGN KEY ("plantUnitId") REFERENCES "PlantUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxInvoice" ADD CONSTRAINT "TaxInvoice_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxInvoice" ADD CONSTRAINT "TaxInvoice_paymentTermId_fkey" FOREIGN KEY ("paymentTermId") REFERENCES "PaymentTerms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxInvoice" ADD CONSTRAINT "TaxInvoice_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxInvoice" ADD CONSTRAINT "TaxInvoice_refSalesOrderId_fkey" FOREIGN KEY ("refSalesOrderId") REFERENCES "SalesOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxInvoiceLineItem" ADD CONSTRAINT "TaxInvoiceLineItem_taxInvoiceId_fkey" FOREIGN KEY ("taxInvoiceId") REFERENCES "TaxInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
