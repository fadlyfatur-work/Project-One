PROJECT ONE

MINGGU 1
 Repo rapi: struktur apps/api dan apps/web sudah ada
 Postgres jalan via Docker Compose dan punya volume
 Backend Express jalan dan endpoint GET /api/health mengembalikan JSON
 Frontend SvelteKit jalan dan punya layout + nav placeholder
 Tombol “Cek API Health” di FE berhasil fetch dari BE


0. Jalanin Docker
docker compose up -d
-- docker compose ps (optional untuk cek docker berjalan)
-- docker logs -f baseweb_postgres (optional cek logs)
-- docker exec -it baseweb_postgres psql -U postgres -d baseweb (optional cek db)


1. Jalankan Prisma
*jika sudah ada perubahan
npx prisma migrate dev --name [nama]
