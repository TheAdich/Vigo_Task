/*
  Warnings:

  - Added the required column `referrerId` to the `Referal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Referal" ADD COLUMN     "referrerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Referal" ADD CONSTRAINT "Referal_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
