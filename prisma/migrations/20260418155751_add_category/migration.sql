-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "isUsedInItemName" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "classificationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "Classification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
