-- Index change only: no rows or columns are touched. A healer may now offer one service as several
-- session options, so offerings are unique per (healer, service, sessions) instead of (healer, service).
-- Every existing row already satisfies the wider key.

-- DropIndex
DROP INDEX "HealerService_healerId_serviceId_key";

-- CreateIndex
CREATE UNIQUE INDEX "HealerService_healerId_serviceId_sessions_key" ON "HealerService"("healerId", "serviceId", "sessions");
