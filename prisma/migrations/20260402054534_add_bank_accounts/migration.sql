-- CreateTable
CREATE TABLE "BankAccounts" (
    "id" SERIAL NOT NULL,
    "account_number" TEXT NOT NULL,
    "bank_name" TEXT NOT NULL,
    "ifsc_code" TEXT NOT NULL,
    "branch_name" TEXT NOT NULL,
    "branch_code" TEXT NOT NULL,
    "micr_code" TEXT NOT NULL,
    "bank_address" TEXT NOT NULL,
    "account_name" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "opening_balance" DOUBLE PRECISION NOT NULL,
    "credit_or_debit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankAccounts_pkey" PRIMARY KEY ("id")
);
