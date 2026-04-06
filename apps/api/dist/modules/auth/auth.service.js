import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { signAccessToken, signRefreshToken } from "../../utils/jwt.js";
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ["student", "professor", "moderator", "admin"], default: "student" }
}, { timestamps: true });
export const User = mongoose.models.User || mongoose.model("User", userSchema);
export async function register(name, email, password) {
    const existing = await User.findOne({ email });
    if (existing) {
        const err = new Error("Email already in use");
        err.statusCode = 409;
        throw err;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role: "student" });
    const access = signAccessToken({ sub: user.id, role: user.role });
    const refresh = signRefreshToken({ sub: user.id, role: user.role });
    return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, access, refresh };
}
export async function login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
        const err = new Error("Invalid credentials");
        err.statusCode = 401;
        throw err;
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
        const err = new Error("Invalid credentials");
        err.statusCode = 401;
        throw err;
    }
    const access = signAccessToken({ sub: user.id, role: user.role });
    const refresh = signRefreshToken({ sub: user.id, role: user.role });
    return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, access, refresh };
}
