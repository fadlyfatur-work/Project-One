import { ZodError } from "zod";
import { loginSchema, registerSchema } from "./auth.schemas.js";
import * as authService from "./auth.services.js";
import { parse } from "node:path";
import { refreshCookieOption } from "../../utils/cookies.js";

function zodToFieldErrors(err:ZodError) {
    const fieldErrors:Record<string, string[]> = {};

    for (const issue of err.issues){
        const field = issue.path.join(".") || "body";
        if(!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(issue.message);
    }

    return fieldErrors
}

export async function registerHandler(req:any, res:any) {
        const parsed = registerSchema.safeParse(req.body);
        if(!parsed.success){
            return res.status(400).json({
                error:{
                    code: "VALIDATION_ERROR",
                    message: "Input tidak valid",
                    fields: zodToFieldErrors(parsed.error)
                },
            });
    }
    const {email, username, password} = parsed.data;
    const result = await authService.register(email, username, password);

    if(!result.ok){
        if (result.code === "Email_taken") {
            return res.status(409).json({ error: { code: result.code, message: "Email sudah dipakai" } });
        }
        if (result.code === "Username_taken") {
            return res.status(409).json({ error: { code: result.code, message: "Username sudah dipakai" } });
        }
        return res.status(409).json({ error: { code: result.code, message: "Data sudah dipakai" } });
    }

    return res.status(201).json({
        data:{
            user: result.user
        }
    });
}

export async function loginHandler(req:any, res:any) {
    const parsed = loginSchema.safeParse(req.body);
    if(!parsed.success){
        return res.status(400).json({
            error:{
                code:"VALIDATION_ERROR",
                message: "Input tidak valid!",
                fields: zodToFieldErrors(parsed.error)
            }
        })
    }

    const result = await authService.login(parsed.data.email, parsed.data.password);

    if(!result.ok){
        return res.status(401).json({
            error:{
                code: result.code,
                message: "Email atau password salah!"
            }
        });
    }
    // 5. set cookie dengan nama rt
    res.cookie("rt", result.refreshToken, refreshCookieOption());
    return res.json({data:{
        accessToken: result.accessToken, user: result.user
    }});
}

export async function refreshHandler(req:any, res:any) {
    const rt = req.cookie?.rt;
    if(!rt) return res.status(401).json({
        error:{
            code: "NO_REFRESH",
            message: "Tidak ada refresh token!"
        }
    });

    const result = await authService.refresh(rt);
    if(!result.ok) return res.status(401).json({
        error: {
            code: result.code,
            message: "Refersh token tidak valid!"
        }
    });

    return res.json({
        data:{
            accessToken: result.accessToken, 
            user: result.user
        }
    })

}

export async function logoutHandler(req:any, res:any) {
    const rt = req.cookies?.rt;
    if(rt) await authService.logout(rt);

    res.clearCookie("rt", { ...refreshCookieOption() });
    return res.json({
        data:{
            ok:true
        }
    });
}