-- AlterTable
ALTER TABLE "PurchaseInquiry" DROP COLUMN IF EXISTS "suppliers",
ADD COLUMN "supplierId" INTEGER;

-- CreateIndex
CREATE INDEX "PurchaseInquiry_supplierId_idx" ON "PurchaseInquiry"("supplierId");

-- AddForeignKey
ALTER TABLE "PurchaseInquiry" ADD CONSTRAINT "PurchaseInquiry_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
