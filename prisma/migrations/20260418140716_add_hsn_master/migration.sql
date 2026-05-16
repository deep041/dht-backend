-- CreateTable
CREATE TABLE "HsnMaster" (
    "id" SERIAL NOT NULL,
    "hsnCode" TEXT NOT NULL,
    "gstSlab" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HsnMaster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HsnMaster_hsnCode_key" ON "HsnMaster"("hsnCode");
