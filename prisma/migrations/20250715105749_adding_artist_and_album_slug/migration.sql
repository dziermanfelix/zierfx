/*
  Warnings:

  - Added the required column `slug` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Artist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "slug" TEXT NOT NULL;
