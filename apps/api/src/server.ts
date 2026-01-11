//Digunakan untuk menyalakan mesin/apps atau tombol ON.

import "dotenv/config";
import { createApp } from "./app.js";

const app = createApp();

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
    console.log(`[api] running on http://localhost:${PORT}`);
});