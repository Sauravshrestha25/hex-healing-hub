-- Additive only: three new nullable columns. Existing bookings keep them empty.

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "address" TEXT,
ADD COLUMN     "age" INTEGER,
ADD COLUMN     "purpose" TEXT;
