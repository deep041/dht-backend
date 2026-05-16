-- CreateTable
CREATE TABLE "RawMaterial" (
    "id" SERIAL NOT NULL,
    "shapeId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "itemName" TEXT NOT NULL,
    "description" TEXT,
    "grade" TEXT,
    "unitId" INTEGER NOT NULL,
    "purchaseRate" DOUBLE PRECISION NOT NULL,
    "sellingRate" DOUBLE PRECISION NOT NULL,
    "hsnId" INTEGER NOT NULL,
    "gstSlab" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "scrapItemId" INTEGER,
    "allowedExcessQty" DOUBLE PRECISION,
    "thickness" DOUBLE PRECISION,
    "leadTimeDays" INTEGER,
    "minStockQty" DOUBLE PRECISION,
    "minOrderQty" DOUBLE PRECISION,
    "valuationMethod" TEXT,
    "isDimensional" BOOLEAN NOT NULL DEFAULT false,
    "isScrap" BOOLEAN NOT NULL DEFAULT false,
    "allowNegativeStock" BOOLEAN NOT NULL DEFAULT false,
    "inspectionRequired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RawMaterial_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RawMaterial" ADD CONSTRAINT "RawMaterial_hsnId_fkey" FOREIGN KEY ("hsnId") REFERENCES "HsnMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
