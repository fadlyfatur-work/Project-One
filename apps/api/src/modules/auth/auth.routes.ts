import { Router } from "express";
import { loginHandler, logoutHandler, refreshHandler, registerHandler } from "./auth.controllers.js";

const route = Router();

route.post("/register", registerHandler);
route.post("/login", loginHandler);
route.post("/refresh", refreshHandler);
route.post("/logout", logoutHandler);

export default route;