/*
  Warnings:

  - Added the required column `qrcode` to the `passageiros` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "passageiros" ADD COLUMN     "qrcode" TEXT NOT NULL;
