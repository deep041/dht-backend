-- CreateEnum
CREATE TYPE "ItemTransactionAction" AS ENUM ('ADD', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "ItemTransactionSource" AS ENUM ('ITEM', 'LEAD', 'QUOTATION', 'SALES_ORDER', 'TAX_INVOICE', 'PURCHASE_INDENT');

-- CreateTable
CREATE TABLE "ItemTransaction" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "action" "ItemTransactionAction" NOT NULL,
    "sourceModule" "ItemTransactionSource" NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "sourceLineItemId" INTEGER,
    "qty" DOUBLE PRECISION,
    "rate" DOUBLE PRECISION,
    "unitId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ItemTransaction_itemId_idx" ON "ItemTransaction"("itemId");

-- CreateIndex
CREATE INDEX "ItemTransaction_sourceModule_sourceId_idx" ON "ItemTransaction"("sourceModule", "sourceId");

-- CreateIndex
CREATE INDEX "ItemTransaction_createdAt_idx" ON "ItemTransaction"("createdAt");

-- AddForeignKey
ALTER TABLE "ItemTransaction" ADD CONSTRAINT "ItemTransaction_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
