import { ContentRequest } from "./content-request.model.js";
export function generateVerificationCode() {
    return Math.random().toString().slice(2, 8).padStart(6, "0");
}
export async function createContentRequest(email) {
    const normalizedEmail = email.toLowerCase().trim();
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await ContentRequest.findOneAndUpdate({ email: normalizedEmail }, { email: normalizedEmail, code, expiresAt, verifiedAt: null }, { upsert: true, new: true, setDefaultsOnInsert: true });
    return { email: normalizedEmail, code };
}
export async function verifyCode(email, code) {
    const normalizedEmail = email.toLowerCase().trim();
    const record = await ContentRequest.findOne({
        email: normalizedEmail,
        code,
        expiresAt: { $gt: new Date() }
    });
    if (!record) {
        return false;
    }
    record.verifiedAt = new Date();
    await record.save();
    return true;
}
export async function isUserVerified(email) {
    const normalizedEmail = email.toLowerCase().trim();
    const record = await ContentRequest.findOne({
        email: normalizedEmail,
        verifiedAt: { $exists: true, $ne: null }
    }).select("_id");
    return Boolean(record);
}
export function formatVerificationEmail(email, code) {
    return {
        to: email,
        subject: "Your Content Contributor Verification Code",
        text: `Hello,\n\n` +
            `You have requested to become a content contributor.\n\n` +
            `Your verification code is: ${code}\n\n` +
            `This code will expire in 24 hours.\n\n` +
            `If you did not request this, please ignore this email.`,
        html: `<h2>Content Contributor Verification</h2>` +
            `<p>Hello,</p>` +
            `<p>You have requested to become a content contributor.</p>` +
            `<p><strong>Your verification code is: <span style="font-size: 24px; letter-spacing: 2px;">${code}</span></strong></p>` +
            `<p>This code will expire in 24 hours.</p>` +
            `<p>If you did not request this, please ignore this email.</p>`
    };
}
