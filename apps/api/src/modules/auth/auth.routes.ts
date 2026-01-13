import { Router } from "express";
import { loginHandler, logoutHandler, meHandler, refreshHandler, registerHandler } from "./auth.controllers.js";
import { requireAuth } from "../../middlewares/requireAuth.js";

const route = Router();

route.post("/register", registerHandler);
route.post("/login", loginHandler);
route.post("/refresh", refreshHandler);
route.post("/logout", logoutHandler);

//-------------------------------------------
route.get("/check-me", requireAuth, meHandler);

export default route;