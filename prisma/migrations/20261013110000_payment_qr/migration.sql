-- Additive only: one new table and two new nullable columns. Existing bookings are untouched.

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "paymentProof" TEXT,
ADD COLUMN     "paymentVerifiedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "PaymentSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "qrImage" TEXT,
    "instructions" TEXT NOT NULL DEFAULT '',
    "required" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentSettings_pkey" PRIMARY KEY ("id")
);
