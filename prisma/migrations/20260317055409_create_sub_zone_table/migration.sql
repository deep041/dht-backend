-- CreateEnum
CREATE TYPE "SubZoneStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "sub_zones" (
    "id" SERIAL NOT NULL,
    "subZoneTitle" TEXT NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "regionId" INTEGER NOT NULL,
    "status" "SubZoneStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_zones_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sub_zones" ADD CONSTRAINT "sub_zones_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_zones" ADD CONSTRAINT "sub_zones_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
