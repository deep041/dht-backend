/*
  Warnings:

  - The values [ACTIVE,INACTIVE] on the enum `RegionStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ACTIVE,INACTIVE] on the enum `SubZoneStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ACTIVE,INACTIVE] on the enum `ZoneStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RegionStatus_new" AS ENUM ('active', 'inactive');
ALTER TABLE "public"."Region" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Region" ALTER COLUMN "status" TYPE "RegionStatus_new" USING ("status"::text::"RegionStatus_new");
ALTER TYPE "RegionStatus" RENAME TO "RegionStatus_old";
ALTER TYPE "RegionStatus_new" RENAME TO "RegionStatus";
DROP TYPE "public"."RegionStatus_old";
ALTER TABLE "Region" ALTER COLUMN "status" SET DEFAULT 'active';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SubZoneStatus_new" AS ENUM ('active', 'inactive');
ALTER TABLE "public"."sub_zones" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "sub_zones" ALTER COLUMN "status" TYPE "SubZoneStatus_new" USING ("status"::text::"SubZoneStatus_new");
ALTER TYPE "SubZoneStatus" RENAME TO "SubZoneStatus_old";
ALTER TYPE "SubZoneStatus_new" RENAME TO "SubZoneStatus";
DROP TYPE "public"."SubZoneStatus_old";
ALTER TABLE "sub_zones" ALTER COLUMN "status" SET DEFAULT 'active';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ZoneStatus_new" AS ENUM ('active', 'inactive');
ALTER TABLE "public"."zones" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "zones" ALTER COLUMN "status" TYPE "ZoneStatus_new" USING ("status"::text::"ZoneStatus_new");
ALTER TYPE "ZoneStatus" RENAME TO "ZoneStatus_old";
ALTER TYPE "ZoneStatus_new" RENAME TO "ZoneStatus";
DROP TYPE "public"."ZoneStatus_old";
ALTER TABLE "zones" ALTER COLUMN "status" SET DEFAULT 'active';
COMMIT;

-- AlterTable
ALTER TABLE "Region" ALTER COLUMN "status" SET DEFAULT 'active';

-- AlterTable
ALTER TABLE "sub_zones" ALTER COLUMN "status" SET DEFAULT 'active';

-- AlterTable
ALTER TABLE "zones" ALTER COLUMN "status" SET DEFAULT 'active';
