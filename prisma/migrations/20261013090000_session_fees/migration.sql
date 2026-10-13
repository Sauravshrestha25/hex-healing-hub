-- Additive only: nothing is dropped or rewritten. Existing offerings become one session priced
-- per session (what they already meant); existing bookings keep an empty session count.

-- CreateEnum
CREATE TYPE "FeeType" AS ENUM ('PER_SESSION', 'PACKAGE');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "sessions" INTEGER;

-- AlterTable
ALTER TABLE "HealerService" ADD COLUMN     "feeType" "FeeType" NOT NULL DEFAULT 'PER_SESSION',
ADD COLUMN     "sessions" INTEGER NOT NULL DEFAULT 1;
