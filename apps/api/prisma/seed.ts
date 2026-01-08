import "dotenv/config";
import bcrypt from "bcrypt";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "@prisma/client";

const { PrismaClient, RoleKey } = pkg;

// koneksi via pg Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// adapter Prisma v7
const adapter = new PrismaPg(pool);

// PrismaClient wajib pakai adapter (Prisma v7)
const prisma = new PrismaClient({ adapter });

async function seedRoles() {
  const roles = [
    { key: RoleKey.USER, name: "User" },
    { key: RoleKey.ADMIN, name: "Admin" },
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { key: r.key },
      update: { name: r.name },
      create: { key: r.key, name: r.name },
    });
  }
}

async function seedUser() {
  const adminRole = await prisma.role.findUnique({ where: { key: RoleKey.ADMIN } });
  const userRole = await prisma.role.findUnique({ where: { key: RoleKey.USER } });

  if (!adminRole || !userRole) throw new Error("Roles belum ada. Jalankan seedRoles dulu.");

  const adminPass = await bcrypt.hash("Admin123!", 10);
  const userPass = await bcrypt.hash("User123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@app.local" },
    update: { roleId: adminRole.id },
    create: {
      email: "admin@app.local",
      username: "admin",
      passwordHash: adminPass,
      roleId: adminRole.id,
      profile: { create: { fullName: "Admin" } },
    },
  });

  await prisma.user.upsert({
    where: { email: "user@app.local" },
    update: { roleId: userRole.id },
    create: {
      email: "user@app.local",
      username: "user",
      passwordHash: userPass,
      roleId: userRole.id,
      profile: { create: { fullName: "User Demo" } },
    },
  });
}

async function main() {
  await seedRoles();
  await seedUser();
  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // penting: matiin pool biar proses seed berhenti bersih
  });
