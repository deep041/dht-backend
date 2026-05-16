-- CreateTable
CREATE TABLE "SubGroup" (
    "id" SERIAL NOT NULL,
    "isUsedInItemName" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubGroup" ADD CONSTRAINT "SubGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
