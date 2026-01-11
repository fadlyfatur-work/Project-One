import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function signInAccessToken(payload:{sub:string; role:string}) {
    return jwt.sign(payload, JWT_SECRET, {expiresIn: "15m"});
}

export function verifyAccessToken(token:string) {
    return jwt.verify(token, JWT_SECRET) as {sub:string; role:string; iat:number; export:number};
}
