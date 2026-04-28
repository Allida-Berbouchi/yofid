import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { createApp } from "./app.js";
async function main() {
    await connectDB();
    const app = createApp();
    app.listen(env.PORT, () => {
        console.log("\n" + "=".repeat(50));
        console.log(`✅ API running on http://localhost:${env.PORT}`);
        console.log(`📚 Try: curl http://localhost:${env.PORT}/health`);
        console.log("=".repeat(50) + "\n");
    });
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
