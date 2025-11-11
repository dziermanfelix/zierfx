-- CreateTable
CREATE TABLE "Venue" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Venue_name_city_country_key" ON "Venue"("name", "city", "country");

-- Migrate existing Show data to Venue table
INSERT INTO "Venue" ("name", "city", "state", "country", "createdAt", "updatedAt")
SELECT DISTINCT 
    "venue" as "name",
    "city",
    "state",
    "country",
    CURRENT_TIMESTAMP as "createdAt",
    CURRENT_TIMESTAMP as "updatedAt"
FROM "Show"
WHERE "venue" IS NOT NULL
ON CONFLICT ("name", "city", "country") DO NOTHING;

-- Add venueId column to Show table
ALTER TABLE "Show" ADD COLUMN "venueId" INTEGER;

-- Update Show records with the corresponding venueId
UPDATE "Show" s
SET "venueId" = v."id"
FROM "Venue" v
WHERE s."venue" = v."name" 
  AND s."city" = v."city" 
  AND s."country" = v."country";

-- Make venueId NOT NULL after populating it
ALTER TABLE "Show" ALTER COLUMN "venueId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Show" ADD CONSTRAINT "Show_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropColumn - Remove old venue fields from Show
ALTER TABLE "Show" DROP COLUMN "venue";
ALTER TABLE "Show" DROP COLUMN "city";
ALTER TABLE "Show" DROP COLUMN "state";
ALTER TABLE "Show" DROP COLUMN "country";

