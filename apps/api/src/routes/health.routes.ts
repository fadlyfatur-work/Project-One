import { Router } from "express";
// import { healthCheck } from "";

const router = Router();

router.get("/", (_req, res) => {
    res.json({ok: true, service: "api", time: new Date().toISOString() })
});

export default router;
