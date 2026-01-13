import { verifyAccessToken } from "../utils/jwt";

export function requireAuth(req: any, res: any, next: any) {
//   console.log(req.headers);
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ error: { code: "NO_TOKEN", message: "Unauthorized" } });

  try {
    console.log("start verify token");
    const payload = verifyAccessToken(token);
    console.log("payload:", payload);
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch {
    return res.status(401).json({ error: { code: "INVALID_TOKEN", message: "Token tidak valid atau expired" } });
  }
}


export function authMiddleware(req:any, res:any, next) {
  
}