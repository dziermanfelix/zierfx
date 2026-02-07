/*
  Warnings:

  - You are about to drop the `Show` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Venue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Show" DROP CONSTRAINT "Show_venueId_fkey";

-- DropTable
DROP TABLE "Show";

-- DropTable
DROP TABLE "Venue";
