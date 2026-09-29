-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone" TEXT;

-- The owner account can always make changes.
UPDATE "User" SET "isVerified" = true WHERE "role" = 'SUPERADMIN';
