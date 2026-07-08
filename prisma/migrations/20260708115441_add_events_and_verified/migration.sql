-- AlterTable
ALTER TABLE "FreelancerProfile" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT,
    "refId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_name_createdAt_idx" ON "Event"("name", "createdAt");

-- CreateIndex
CREATE INDEX "Event_createdAt_idx" ON "Event"("createdAt");
