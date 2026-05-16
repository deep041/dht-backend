-- CreateTable
CREATE TABLE "PaymentTerms" (
    "id" SERIAL NOT NULL,
    "term_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentTerms_pkey" PRIMARY KEY ("id")
);
