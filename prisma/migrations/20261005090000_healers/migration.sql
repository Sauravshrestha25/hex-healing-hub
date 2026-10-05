-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "durationMinutes" INTEGER,
ADD COLUMN     "healerId" TEXT,
ADD COLUMN     "price" INTEGER,
ADD COLUMN     "reference" TEXT,
ADD COLUMN     "startsAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN     "healerId" TEXT;

-- CreateTable
CREATE TABLE "Healer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "photo" TEXT,
    "experienceYears" INTEGER NOT NULL DEFAULT 0,
    "qualifications" TEXT NOT NULL DEFAULT '',
    "languages" TEXT NOT NULL DEFAULT '',
    "places" TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Healer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealerService" (
    "id" TEXT NOT NULL,
    "healerId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "durationMinutes" INTEGER NOT NULL,

    CONSTRAINT "HealerService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealerAvailability" (
    "id" TEXT NOT NULL,
    "healerId" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "startMinute" INTEGER NOT NULL,
    "endMinute" INTEGER NOT NULL,

    CONSTRAINT "HealerAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealerTimeOff" (
    "id" TEXT NOT NULL,
    "healerId" TEXT NOT NULL,
    "date" DATE NOT NULL,

    CONSTRAINT "HealerTimeOff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Healer_slug_key" ON "Healer"("slug");

-- CreateIndex
CREATE INDEX "Healer_published_order_idx" ON "Healer"("published", "order");

-- CreateIndex
CREATE UNIQUE INDEX "HealerService_healerId_serviceId_key" ON "HealerService"("healerId", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "HealerAvailability_healerId_weekday_key" ON "HealerAvailability"("healerId", "weekday");

-- CreateIndex
CREATE UNIQUE INDEX "HealerTimeOff_healerId_date_key" ON "HealerTimeOff"("healerId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_reference_key" ON "Booking"("reference");

-- CreateIndex
CREATE INDEX "Booking_healerId_startsAt_idx" ON "Booking"("healerId", "startsAt");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_healerId_fkey" FOREIGN KEY ("healerId") REFERENCES "Healer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealerService" ADD CONSTRAINT "HealerService_healerId_fkey" FOREIGN KEY ("healerId") REFERENCES "Healer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealerService" ADD CONSTRAINT "HealerService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealerAvailability" ADD CONSTRAINT "HealerAvailability_healerId_fkey" FOREIGN KEY ("healerId") REFERENCES "Healer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealerTimeOff" ADD CONSTRAINT "HealerTimeOff_healerId_fkey" FOREIGN KEY ("healerId") REFERENCES "Healer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_healerId_fkey" FOREIGN KEY ("healerId") REFERENCES "Healer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

