-- Rename table
ALTER TABLE "LiveDate" RENAME TO "Show";

-- Rename the primary key constraint
ALTER INDEX "TourDate_pkey" RENAME TO "Show_pkey";


