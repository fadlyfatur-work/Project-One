import "dotenv/config";
import { createApp } from "./app.js";
import routes from "./routes/index.js";

const app = createApp();
app.use("/api", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[api] running on http://localhost:${PORT}`);
});