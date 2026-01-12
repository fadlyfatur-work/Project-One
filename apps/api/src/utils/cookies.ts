export function refreshCookieOption() {
    const isProd = process.env.NODE_ENV === "production";
    console.log("cookies-set");
    
    return {
        httpOnly:true,
        secure: isProd,
        sameSite:isProd ? "none" : "lax",
        path: "/auth"
    } as const;
}   