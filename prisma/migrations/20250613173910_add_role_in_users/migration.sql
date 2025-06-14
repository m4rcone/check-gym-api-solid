-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Member');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'Member';
