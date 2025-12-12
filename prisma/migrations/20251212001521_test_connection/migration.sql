/*
  Warnings:

  - You are about to drop the column `address` on the `Show` table. All the data in the column will be lost.
  - You are about to drop the column `mapsUrl` on the `Show` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `Show` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Show" DROP COLUMN "address",
DROP COLUMN "mapsUrl",
DROP COLUMN "zipCode";
