import { ZodError } from "zod";
import { loginSchema, registerSchema } from "./auth.schemas.js";
import * as authService from "./auth.services.js";
import { refreshCookieOption } from "../../utils/cookies.js";
import { prisma } from "../../prisma.js";


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
    console.log("LOGIN HANDLER START!");
    console.log(req.body);
    
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
    res.cookie("rt", result.refreshToken, {
        httpOnly:true,
        secure: false,
        sameSite: "lax",
        path: "/"
    });

    return res.json({
        accessToken: result.accessToken, 
        user: result.user
    });
}

export async function refreshHandler(req:any, res:any) {
    const rt = req.cookies?.rt;
    console.log("refresh cookie: ", req.cookies);
    
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
    console.log("res: ", result.user);
    
    return res.json({
        data:{
            accessToken: result.accessToken, 
            user: result.user
        }
    })

}

export async function logoutHandler(req:any, res:any) {
    console.log(req);
    
    const rt = req.cookies?.rt;
    console.log("refreshToken:", rt);
    
    if(!rt){
        return res.status(401).json({
            data:{
                ok:false,
                message: "Cookies not found!"
            }
        });
    } 
        
    await authService.logout(rt);

    res.clearCookie("rt", { ...refreshCookieOption() });
    return res.json({
        data:{
            ok:true
        }
    });
}

export async function meHandler(req:any, res:any) {
    console.log(req.user);
    
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id:true, email:true, role:true },
    });
    console.log("user: ", user);
    
    return res.json({
        data:{user}
    });

}