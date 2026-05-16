-- CreateTable
CREATE TABLE "CompanyDetails" (
    "id" SERIAL NOT NULL,
    "company_name" TEXT NOT NULL,
    "company_short_name" TEXT NOT NULL,
    "proprietor" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phone_2" TEXT NOT NULL,
    "email_id" TEXT NOT NULL,
    "email_id_2" TEXT NOT NULL,
    "country_id" INTEGER NOT NULL,
    "state_id" INTEGER NOT NULL,
    "pin_code" INTEGER NOT NULL,
    "place" TEXT NOT NULL,
    "state_code" INTEGER NOT NULL,
    "address_line_1" TEXT NOT NULL,
    "address_line_2" TEXT NOT NULL,
    "gst_applicable" BOOLEAN NOT NULL,
    "gst_no" TEXT NOT NULL,
    "pan_no" TEXT NOT NULL,
    "cin_no" TEXT NOT NULL,
    "llpin_no" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "asp_id" INTEGER NOT NULL,
    "asp_password" TEXT NOT NULL,
    "portal_client_user_name" TEXT NOT NULL,
    "portal_client_password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CompanyDetails" ADD CONSTRAINT "CompanyDetails_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyDetails" ADD CONSTRAINT "CompanyDetails_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
