-- CreateEnum
CREATE TYPE "MenuStatus" AS ENUM ('active', 'inactive');

-- CreateTable
CREATE TABLE "roles" (
    "role_name" VARCHAR NOT NULL,
    "id" INTEGER NOT NULL,

    CONSTRAINT "roles_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menus" (
    "id" SERIAL NOT NULL,
    "menu_name" VARCHAR(100) NOT NULL,
    "menu_url" VARCHAR(255),
    "icon_name" VARCHAR(100),
    "parent_menu_id" INTEGER,
    "status" "MenuStatus" NOT NULL DEFAULT 'active',
    "sequence" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "menus_parent_menu_id_idx" ON "menus"("parent_menu_id");

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_parent_menu_id_fkey" FOREIGN KEY ("parent_menu_id") REFERENCES "menus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
