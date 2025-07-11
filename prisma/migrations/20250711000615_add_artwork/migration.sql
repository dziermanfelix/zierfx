/*
  Warnings:

  - You are about to drop the column `artworkUrl` on the `Album` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Album" DROP COLUMN "artworkUrl",
ADD COLUMN     "artwork" TEXT;
