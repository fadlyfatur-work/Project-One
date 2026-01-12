import bcrypt from "bcrypt";
import crypto from "crypto";
import { prisma } from "../../prisma.js";
import { signInAccessToken } from "../../utils/jwt.js";

function sha256(s:string) {
    return crypto.createHash("sha256").update(s).digest("hex");
}

export async function register(email:string, username:string, password:string) {
    //Normalizes
    const normalizeEmail = email.trim().toLowerCase();
    const normalizeUsername = username.trim().toLowerCase();

    const existing = await prisma.user.findFirst({
        where:{
            OR:[{email:normalizeEmail}, {username:normalizeUsername }],
        },
        select: { email:true, username:true }
    });

    if(existing){
        if(existing.email === normalizeEmail){
            return {
                ok:false,
                code:"Email_taken" as const
            };
        }
        if(existing.username === normalizeUsername){
            return {
                ok:false,
                code:"Username_taken" as const
            };
        }
        return {
            ok:false,
            code:"Duplicate" as const
        };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userRole = await prisma.role.findUnique({where: { key:"USER" } });
    if(!userRole) throw new Error("Role USER belum ada, jalankan seed!");

    const user = await prisma.user.create({
        data:{
            email: normalizeEmail, 
            username: normalizeUsername,
            passwordHash, 
            roleId: userRole.id 
        },
        select:{id: true, email: true, username: true, role: true},
    });

    return {ok: true, user};
}

export async function login(identifier:string, password:string) {
    const id = identifier.trim().toLowerCase();

    const user = await prisma.user.findFirst({
        where:{
            OR: [{email:id}, {username:id}],
        },
        include:{
            role:true
        },
    });

    if(!user) return {
        ok:false,
        code:"INVALID CREDENTIALS"
    };
   
    if(!user.role) return {
        ok:false,
        code:"NO ROLE ASSIGNED"
    };

    //pengecekan password
    const passValid = await bcrypt.compare(password, user.passwordHash);
    if (!passValid) return {
        ok:false,
        code:"INVALID CREDENTIALS" as const
    };

    //issue access token + refresh token + store refresh hash
    //1. memasukan userId dan role ke access token
    const accessToken = signInAccessToken({
        sub: user.id, 
        role: user.role.key
    });

    //2. membuat refresh token
    const refreshToken = crypto.randomBytes(48).toString("hex");
    const tokenHash = sha256(refreshToken);

    //3. set expirenya
    const expiresAt = new Date(Date.now()+1000*60*60*24*14); //14 hari

    //4. simpan refresh token ke DB
    await prisma.refreshToken.upsert({
        where:{
            userId: user.id
        },
        update:{},
        create:{
            userId: user.id, 
            tokenHash, expiresAt
        }
    });

    // await prisma.refreshToken.create({
    //     data: { userId: user.id, tokenHash, expiresAt },
    // });

    return {
        ok:true,
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            email: user.email,
            role: user.role.key
        }
    }
}

export async function refresh(RefreshToken:string) {

    const tokenHash = sha256(RefreshToken);
    const row = await prisma.refreshToken.findFirst({
        where:{
            tokenHash, 
            revokedAt: null, 
            expiresAt:{
                gt: new Date()
            }
        },
        include: {user: {
            select:{
                id:true,
                email:true,
                username:true,
                roleId:true,
                role:{
                    select:{
                        key:true, name:true
                    }
                },
            },
        }},
    });

    if(!row) return {
        ok:false,
        code:"INVALID_REFRESH" as const
    };

    if(!row.user.role) return {
        ok:false,
        code:"NO_ROLE_ASSIGNED" as const
    }

    const accessToken = signInAccessToken({
        sub:row.userId,
        role: row.user.role.key
    });

    return{
        ok:true, accessToken, user: {
            id: row?.user.id,
            email: row?.user.email,
            role: row.user.role.key
        }
    };
};

export async function logout(refreshToken:string) {
    const tokenHash = sha256(refreshToken);
    console.log(tokenHash);
    await prisma.refreshToken.updateMany({
        where:{ tokenHash, revokedAt:null },
        data:{revokedAt: new Date() },
    });
    return {ok: true}
}
