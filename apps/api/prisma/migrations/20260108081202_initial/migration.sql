-- CreateEnum
CREATE TYPE "RoleKey" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "m_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "roleId" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "m_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role_key" "RoleKey" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "m_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "m_user_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "full_name" TEXT,
    "phone" TEXT,
    "bio" TEXT,
    "avatar_url" TEXT,
    "tag" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "m_user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "m_users_email_key" ON "m_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "m_users_username_key" ON "m_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "m_roles_name_key" ON "m_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "m_roles_role_key_key" ON "m_roles"("role_key");

-- CreateIndex
CREATE UNIQUE INDEX "m_user_profiles_user_id_key" ON "m_user_profiles"("user_id");

-- AddForeignKey
ALTER TABLE "m_users" ADD CONSTRAINT "m_users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "m_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "m_user_profiles" ADD CONSTRAINT "m_user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "m_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
