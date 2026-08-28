import { Router, type Request, type Response } from "express";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { scrypt, randomBytes } from "node:crypto";
import { promisify } from "node:util";
import { validate } from "../middleware/validate.js";
import { loginSchema, signupSchema, type LoginInput, type SignupInput } from "../validation/schemas.js";
import jwt from "jsonwebtoken";

const scryptAsync = promisify(scrypt);

const authRouter = Router();

// Hash PIN helper using node:crypto
async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
}
// Verify password helper using node:crypto
async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const [hash, salt] = storedHash.split(".");
    if (!hash || !salt) return false;
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return buf.toString("hex") === hash;
}

authRouter.post("/signup", validate(signupSchema), async (req: Request, res: Response) => {
    const { email, password, name } = req.body as SignupInput;

    // 1. Check if email is already taken
    const existingUser = await db.
        select().from(users).
        where(eq(users.email, email));

    if (existingUser.length > 0) {
        return res.status(400).json({ error: "User with the same email already exists" });
    }

    // 2. Hash Password
    const passwordHash = await hashPassword(password);

    // 3. Insert new user into the database
    const [user] = await db.insert(users).values({
        email,
        name,
        passwordHash,
    }).returning();

    if (!user) {
        return res.status(500).json({ error: "Failed to create user" });
    }

    const { passwordHash: _, ...safeUser } = user;

    return res.status(201).json({
        message: "User registered successfully",
        user: safeUser,
    });
});

authRouter.post("/login", validate(loginSchema), async (req: Request, res: Response) => {
    const { email, password } = req.body as LoginInput;

    // 1. Find user by email
    const [user] = await db.
        select().from(users).
        where(eq(users.email, email));

    if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    // 2. Verify Password
    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
    }


    const { passwordHash: _, ...safeUser } = user;
    const token = jwt.sign({ id: user.id, email: user.email },
        process.env.JWT_SECRET as string, { expiresIn: "4h" });

    return res.status(200).json({
        message: "Login successful",
        user: safeUser,
        token,
    });
});

authRouter.post("/tokenIsValid", async (req: Request, res: Response) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) {
            res.json(false);
            return;
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET as string);
        if (!verified) {
            res.json(false);
            return;
        }
        const verifiedToken = verified as { id: number };
        const [user] = await db.select().from(users).where(eq(users.id, verifiedToken.id));

        if (!user) {
            res.json(false);
            return;
        }

        res.json(true);
    } catch (e) {
        res.json(false);
    }
});

authRouter.get("/", (req, res) => {
    res.send("hey from auth");
});

export default authRouter;