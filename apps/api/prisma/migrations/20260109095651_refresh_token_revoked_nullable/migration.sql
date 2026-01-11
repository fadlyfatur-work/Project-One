/*
  Warnings:

  - You are about to drop the `m_user_profiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "m_user_profiles" DROP CONSTRAINT "m_user_profiles_user_id_fkey";

-- AlterTable
ALTER TABLE "refresh_token" ALTER COLUMN "revoked_at" DROP NOT NULL;

-- DropTable
DROP TABLE "m_user_profiles";

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "full_name" TEXT,
    "phone" TEXT,
    "bio" TEXT,
    "avatar_url" TEXT,
    "tag" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "m_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
