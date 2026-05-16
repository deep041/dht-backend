-- CreateTable
CREATE TABLE "Warehouses" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "plant_unit_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Warehouses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Warehouses" ADD CONSTRAINT "Warehouses_plant_unit_id_fkey" FOREIGN KEY ("plant_unit_id") REFERENCES "PlantUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
