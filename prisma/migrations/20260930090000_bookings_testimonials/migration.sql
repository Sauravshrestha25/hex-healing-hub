-- Inquiries become bookings. Renamed in place so existing rows (and their email/message) carry over.
ALTER TYPE "InquiryStatus" RENAME TO "BookingStatus";
ALTER TYPE "BookingStatus" RENAME VALUE 'READ' TO 'CONFIRMED';
ALTER TYPE "BookingStatus" RENAME VALUE 'RESOLVED' TO 'COMPLETED';
ALTER TYPE "BookingStatus" ADD VALUE 'CANCELLED';

ALTER TABLE "Inquiry" RENAME TO "Booking";
ALTER TABLE "Booking" RENAME CONSTRAINT "Inquiry_pkey" TO "Booking_pkey";
ALTER INDEX "Inquiry_status_createdAt_idx" RENAME TO "Booking_status_createdAt_idx";
ALTER TABLE "Booking" RENAME COLUMN "interest" TO "service";
ALTER TABLE "Booking" RENAME COLUMN "message" TO "note";
ALTER TABLE "Booking" ALTER COLUMN "email" DROP NOT NULL;
ALTER TABLE "Booking" ALTER COLUMN "note" DROP NOT NULL;
ALTER TABLE "Booking" ADD COLUMN "centre" TEXT;
ALTER TABLE "Booking" ADD COLUMN "preferredDate" DATE;
ALTER TABLE "Booking" ADD COLUMN "timeOfDay" TEXT;

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "photo" TEXT,
    "service" TEXT,
    "centre" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Testimonial_published_order_idx" ON "Testimonial"("published", "order");
