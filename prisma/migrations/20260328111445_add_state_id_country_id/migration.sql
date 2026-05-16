/*
  Warnings:

  - You are about to drop the column `country` on the `PlantUnit` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `PlantUnit` table. All the data in the column will be lost.
  - Added the required column `countryId` to the `PlantUnit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stateId` to the `PlantUnit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlantUnit" DROP COLUMN "country",
DROP COLUMN "state",
ADD COLUMN     "countryId" INTEGER NOT NULL,
ADD COLUMN     "stateId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "PlantUnit" ADD CONSTRAINT "PlantUnit_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantUnit" ADD CONSTRAINT "PlantUnit_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
