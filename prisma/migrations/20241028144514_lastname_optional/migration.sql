/*
  Warnings:

  - You are about to drop the column `roll` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "roll",
ALTER COLUMN "last_name" DROP NOT NULL;
