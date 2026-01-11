//definisi sistem

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";

export function createApp(){
    const app = express();

    app.use(cors({
        origin: ["http://localhost:5173"],
        credentials: true
    }));
    app.use(express.json());
    app.use(cookieParser());

    //Mount semua 'routes' disini
    app.use("/api", routes);

    return app;
}

