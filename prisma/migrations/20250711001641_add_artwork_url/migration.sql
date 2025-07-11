/*
  Warnings:

  - You are about to drop the column `artwork` on the `Album` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Album" DROP COLUMN "artwork",
ADD COLUMN     "artworkUrl" TEXT;
